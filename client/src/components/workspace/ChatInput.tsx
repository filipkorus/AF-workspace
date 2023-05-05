import React, {useState} from 'react';
import {Button, css} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import theme from "../../utils/theme";



const ChatInput = ({handleSendMessage}: { handleSendMessage: (msg: { text: string, }) => void }) => {
    const [msg, setMsg] = useState("");
    const sendChat = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // const timestamp = Date.now().toLocaleString();
            if (msg.length > 0) {
                handleSendMessage({text: msg });
                setMsg("");
            }
        }
    }
    const handleButtonClick = (e:React.MouseEvent) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSendMessage({text: msg });
            setMsg("");
        }
    }

    return (
        <>
            <div className="input-container" style={{ display: "flex",justifyContent:"space-between"}}>
                <textarea
                    style={{padding:"5px",marginLeft: "1px", backgroundColor: "lavenderblush",borderTopLeftRadius:"10px",borderBottomLeftRadius: "10px"}}
                    placeholder="Chat with your mates"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    onKeyDown={(event) => sendChat(event)}
                    rows={3}
                    wrap="soft"
                    aria-multiline={true}
                />

                <Button className="sending" variant="contained"  type="submit" onClick={handleButtonClick}
                        style={{backgroundColor: "lavenderblush",borderBottomRightRadius:"10px",borderTopRightRadius: "10px", maxWidth:"30px",width: "fit-content"}}>
                    <SendIcon style={{color:theme.palette.primary.main}}/>
                </Button>

            </div>
        </>
    );
};

export default ChatInput;
