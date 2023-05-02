import React, {useState} from 'react';
import {Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import theme from "../../utils/theme";


const ChatInput = ({handleSendMessage}: { handleSendMessage: (msg: {text: string, timestamp:string}) => void }) => {
    const [msg, setMsg] = useState("");
    const sendChat = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const timestamp = Date.now().toLocaleString();
        if (msg.length > 0) {
            handleSendMessage({text: msg,timestamp});
            setMsg("");
        }
    };

    return (
        <>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <input style={{backgroundColor: "lightgray"}}
                       color="info"
                       type="text"
                       placeholder="Chat with your mates"
                       onChange={(e) => setMsg(e.target.value)}
                       value={msg}
                />
                <Button variant="contained" endIcon={<SendIcon/>} type="submit"
                        style={{backgroundColor: theme.palette.primary.main}}>
                    Send
                </Button>
            </form>
        </>
    );
};

export default ChatInput;
