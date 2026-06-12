from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/mern-chat')


def get_db_data():
    """Fetch real QuizResult and Quiz documents from MongoDB."""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        db = client.get_default_database()

        results = list(db.quizresults.find({}, {'user': 1, 'quiz': 1, 'score': 1, '_id': 0}))
        quizzes = list(db.quizzes.find({}, {'_id': 1, 'title': 1}))
        client.close()

        # Compute per-quiz average score to derive difficulty label
        quiz_avg: dict = {}
        for r in results:
            qid = str(r['quiz'])
            quiz_avg.setdefault(qid, []).append(r['score'])

        def difficulty(qid: str) -> str:
            scores = quiz_avg.get(qid, [])
            if not scores:
                return 'mediu'
            avg = sum(scores) / len(scores)
            return 'ușor' if avg >= 70 else 'mediu' if avg >= 40 else 'greu'

        quiz_map = {
            str(q['_id']): {'title': q.get('title', 'Quiz'), 'difficulty': difficulty(str(q['_id']))}
            for q in quizzes
        }
        scores = [
            {'userId': str(r['user']), 'quizId': str(r['quiz']), 'score': r['score']}
            for r in results
        ]
        return scores, quiz_map

    except Exception as exc:
        print(f'[Flask] MongoDB error: {exc}')
        return [], {}


def build_score_matrix(scores: list) -> pd.DataFrame:
    if not scores:
        return pd.DataFrame()
    df = pd.DataFrame(scores)
    return df.pivot(index='userId', columns='quizId', values='score').fillna(0)


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Recommendation service is running'})


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    if not data or 'userId' not in data:
        return jsonify({'error': 'userId is required'}), 400

    user_id = data['userId']
    scores, quiz_map = get_db_data()

    if not scores:
        return jsonify({
            'userId': user_id,
            'strategy': 'db_unavailable',
            'recommendations': []
        })

    score_matrix = build_score_matrix(scores)

    # --- Cold start: user has no history in the score matrix ---
    if user_id not in score_matrix.index:
        # Return the 5 most-solved quizzes as a popularity baseline
        from collections import Counter
        quiz_counts = Counter(r['quizId'] for r in scores)
        top_quizzes = [qid for qid, _ in quiz_counts.most_common(5) if qid in quiz_map]
        recs = [
            {
                'quizId': qid,
                'title': quiz_map[qid]['title'],
                'score': round(0.8 - i * 0.05, 2),
                'difficulty': quiz_map[qid]['difficulty'],
            }
            for i, qid in enumerate(top_quizzes)
        ]
        return jsonify({'userId': user_id, 'strategy': 'cold_start_popularity', 'recommendations': recs})

    # --- Sparsity check: too few users for reliable k-NN ---
    if len(score_matrix) < 3:
        user_solved = set(score_matrix.columns[score_matrix.loc[user_id] > 0])
        unsolved = [qid for qid in quiz_map if qid not in user_solved][:5]
        recs = [
            {
                'quizId': qid,
                'title': quiz_map[qid]['title'],
                'score': 0.70,
                'difficulty': quiz_map[qid]['difficulty'],
            }
            for qid in unsolved
        ]
        return jsonify({'userId': user_id, 'strategy': 'popularity_fallback', 'recommendations': recs})

    # --- Collaborative k-NN filtering ---
    k = min(5, len(score_matrix) - 1)
    knn = NearestNeighbors(n_neighbors=k, metric='cosine')
    knn.fit(score_matrix.values)

    user_idx = score_matrix.index.get_loc(user_id)
    _, indices = knn.kneighbors(score_matrix.iloc[user_idx].values.reshape(1, -1))
    neighbor_indices = indices[0][1:]  # exclude self (distance 0)

    user_solved = set(score_matrix.columns[score_matrix.iloc[user_idx] > 0])

    neighbor_scores: dict = {}
    for n_idx in neighbor_indices:
        for quiz_id, score in score_matrix.iloc[n_idx].items():
            if score > 0 and quiz_id not in user_solved:
                neighbor_scores.setdefault(quiz_id, []).append(score)

    final_recs = []
    for qid, sc_list in neighbor_scores.items():
        q = quiz_map.get(qid, {'title': 'Quiz', 'difficulty': 'mediu'})
        final_recs.append({
            'quizId': qid,
            'title': q['title'],
            'score': round(float(np.mean(sc_list)) / 100.0, 2),
            'difficulty': q['difficulty'],
        })

    final_recs.sort(key=lambda x: x['score'], reverse=True)

    return jsonify({
        'userId': user_id,
        'strategy': 'collaborative_knn',
        'recommendations': final_recs[:5],
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
