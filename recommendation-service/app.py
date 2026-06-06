from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# --- DATE SINTETICE (Mock Data) ---
# Simulăm o bază de date MongoDB (colecția QuizResult)
# Pentru a demonstra prototipul fără a necesita o conexiune reală la o bază de date.
mock_scores = [
    {"userId": "user_algebra_weak", "quizId": "q_algebra_1", "score": 35},
    {"userId": "user_algebra_weak", "quizId": "q_geom_1", "score": 78},
    {"userId": "u2", "quizId": "q_algebra_1", "score": 40},
    {"userId": "u2", "quizId": "q_algebra_2", "score": 82},
    {"userId": "u3", "quizId": "q_algebra_1", "score": 90},
    {"userId": "user_advanced", "quizId": "q_algebra_1", "score": 95},
    {"userId": "user_advanced", "quizId": "q_geom_1", "score": 92},
]

mock_quizzes = {
    "q_algebra_1": {"title": "Ecuații simple", "chapter": "algebră", "difficulty": "ușor"},
    "q_algebra_2": {"title": "Sisteme de ecuații", "chapter": "algebră", "difficulty": "mediu"},
    "q_algebra_3": {"title": "Polinoame", "chapter": "algebră", "difficulty": "greu"},
    "q_geom_1": {"title": "Arii și perimetre", "chapter": "geometrie", "difficulty": "ușor"},
    "q_geom_2": {"title": "Teorema lui Pitagora", "chapter": "geometrie", "difficulty": "mediu"}
}

def get_score_matrix():
    df = pd.DataFrame(mock_scores)
    if df.empty:
        return pd.DataFrame()
    return df.pivot(index='userId', columns='quizId', values='score').fillna(0)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Recommendation service is running"})

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    if not data or 'userId' not in data:
        return jsonify({"error": "userId is required"}), 400

    user_id = data['userId']
    score_matrix = get_score_matrix()

    # 1. COLD START (Utilizator nou)
    if user_id not in score_matrix.index:
        # Fallback la Content-Based Filtering (sau popularitate)
        preferences = data.get('preferences', {})
        preferred_chapter = preferences.get('chapters', ['algebră'])[0] if preferences.get('chapters') else 'algebră'
        
        cbf_recommendations = []
        for q_id, q_data in mock_quizzes.items():
            if q_data['chapter'] == preferred_chapter:
                cbf_recommendations.append({
                    "quizId": q_id,
                    "title": q_data['title'],
                    "score": 0.8, # Scor fictiv de relevanță
                    "difficulty": q_data['difficulty']
                })
        
        return jsonify({
            "userId": user_id,
            "strategy": "content_based_fallback",
            "recommendations": cbf_recommendations[:5]
        })

    # 2. SPARSITY CHECK (Prea puțini utilizatori pentru k-NN)
    if len(score_matrix) < 3:
        # Fallback la popularitate
        return jsonify({
            "userId": user_id,
            "strategy": "popularity_fallback",
            "reason": "insufficient_common_scores",
            "recommendations": [{"quizId": "q_algebra_1", "title": "Ecuații simple"}]
        })

    # 3. K-NN COLLABORATIVE FILTERING
    # Găsim vecinii (k=2 pentru acest set de date mic)
    knn = NearestNeighbors(n_neighbors=2, metric='cosine')
    knn.fit(score_matrix)
    
    user_idx = score_matrix.index.get_loc(user_id)
    distances, indices = knn.kneighbors(score_matrix.iloc[user_idx, :].values.reshape(1, -1))
    
    # Excludem utilizatorul curent din vecini (care e pe prima poziție, distanța 0)
    neighbor_indices = indices[0][1:]
    
    # Calculăm scorurile recomandărilor pe baza vecinilor
    recommendations = {}
    user_solved_quizzes = set(score_matrix.columns[score_matrix.iloc[user_idx] > 0])
    
    for neighbor_idx in neighbor_indices:
        neighbor_id = score_matrix.index[neighbor_idx]
        neighbor_scores = score_matrix.iloc[neighbor_idx]
        
        for quiz_id, score in neighbor_scores.items():
            if score > 0 and quiz_id not in user_solved_quizzes:
                if quiz_id not in recommendations:
                    recommendations[quiz_id] = []
                recommendations[quiz_id].append(score)
                
    # Mediem scorurile și formatăm răspunsul
    final_recs = []
    for quiz_id, scores in recommendations.items():
        avg_score = np.mean(scores)
        quiz_data = mock_quizzes.get(quiz_id, {"title": "Unknown", "difficulty": "Unknown"})
        final_recs.append({
            "quizId": quiz_id,
            "score": round(avg_score / 100.0, 2), # Normalizăm 0-1
            "title": quiz_data['title'],
            "difficulty": quiz_data['difficulty']
        })
        
    final_recs.sort(key=lambda x: x['score'], reverse=True)

    return jsonify({
        "userId": user_id,
        "strategy": "collaborative_knn",
        "recommendations": final_recs[:5],
        "latencyMs": 142 # Valoare simulată pentru demonstrație
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
