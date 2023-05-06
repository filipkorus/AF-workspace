import React, {useState, useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import ChatInput from './ChatInput';
import {useSocket} from '../../contexts/SocketContext';
import Message from "./Message";
import {useAuth} from "../../contexts/AuthContext";
import '../../styles/Scroll.css';

const Chat = () => {
    const {socket, isConnected}: any = useSocket();
    const [messages, setMessages] = useState<{ text: string, timestamp: string, sender: string, id: number }[]>([]);
    const messageEndRef = useRef<HTMLDivElement>(null); // referencja do końca diva z wiadomościami
    const {currentUser}: any = useAuth();
    const handleSendMessage = (msg: { text: string }) => {
        if (!isConnected) return;

        setMessages([...messages, {
            ...msg,
            timestamp: getCurrentTimestamp(),
            sender: currentUser.name,
            id: messages.length + 1
        }]);
    };
    const getCurrentTimestamp = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // miesiące są liczone od 0 do 11, więc dodajemy 1 i formatujemy zerem z przodu
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "auto"}); // przewijanie do końca diva z wiadomościami po zmianie zawartości
    }, [messages]);

    return (
        <>
            <Box style={{
                display: "inline-block",
                position: 'fixed',
                overflowX: "hidden",
                wordBreak: 'normal',
                width: "250px",
                marginLeft: "2px",
                marginRight: "2px",
                maxHeight: "79%",
                overflowY: "auto",
            }}>
                {messages.map((message, index) => (
                    <Message name={message.sender} content={message.text} timestamp={message.timestamp}
                             key={index} isMyMessage={index % 2 == 0}/>
                ))}
                <div ref={messageEndRef}/>
                {/* pusty div użyty do ustawienia referencji */}
            </Box>
            <div style={{position: 'fixed', bottom: "20px", borderRadius: "10px"}}>
                <ChatInput handleSendMessage={handleSendMessage}/>
            </div>
        </>
    );
};

export default Chat;
