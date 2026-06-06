import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { useHistory } from 'react-router-dom';

const ChatContext = createContext()
const ChatProvider = ({children}) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chatState, setChatState] = useState([]);
    const history = useHistory();
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo) {
            history.push('/');
        }
    }, [history]);

    return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chatState, setChatState, notification, setNotification}}>
        {children}
    </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;