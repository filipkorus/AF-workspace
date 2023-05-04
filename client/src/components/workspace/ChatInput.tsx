import React, { useState} from 'react';
import {Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import theme from "../../utils/theme";


const ChatInput = ({handleSendMessage}: { handleSendMessage: (msg: { text: string, timestamp: string }) => void }) => {
    const [msg, setMsg] = useState("");
        const sendChat = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const timestamp = Date.now().toLocaleString();
            if (msg.length > 0) {
                handleSendMessage({text: msg, timestamp});
                setMsg("");
            }
        }
    }

    return (
        <>
            <form className="input-container">
                <textarea

                    style={{marginLeft: "1px", backgroundColor: "lavenderblush", borderRadius: "10px", width: "100%"}}
                    placeholder="Chat with your mates"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    onKeyDown={(event) => sendChat(event)}
                    rows={2}
                    wrap="soft"
                    aria-multiline={true}
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
