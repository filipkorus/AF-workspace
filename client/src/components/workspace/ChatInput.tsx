import React, {useState} from 'react';
import {Box, Button, css} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import theme from "../../utils/theme";
import {useSocket} from '../../contexts/SocketContext';
import { SxProps } from '@mui/system';

const ChatInput = ({handleSendMessage, placeholder, sx}: {
    handleSendMessage: (text: string) => void,
    placeholder?: string,
    sx?: SxProps
}) => {
    const {isConnected}: any = useSocket();
    const [msg, setMsg] = useState("");
    const sendChat = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // const timestamp = Date.now().toLocaleString();
            if (msg.length > 0) {
                handleSendMessage(msg);
                setMsg("");
            }
        }
    }
    const handleButtonClick = (e:React.MouseEvent) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSendMessage(msg);
            setMsg("");
        }
    }

    return (
        <>
            <Box className="input-container" style={{ display: "flex",justifyContent:"space-between"}} sx={sx}>
                <textarea
                    style={{padding:"5px",marginLeft: "1px", backgroundColor: "lavenderblush",borderTopLeftRadius:"10px",borderBottomLeftRadius: "10px", border: `1px solid ${theme.palette.primary.main}`}}
                    placeholder={placeholder || "Chat with your mates"}
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    onKeyDown={(event) => sendChat(event)}
                    rows={3}
                    wrap="soft"
                    aria-multiline={true}
                    disabled={!isConnected}
                />

                <Button className="sending" variant="contained" disabled={!isConnected} type="submit" onClick={handleButtonClick}
                        style={{backgroundColor: "lavenderblush",borderBottomRightRadius:"10px",borderTopRightRadius: "10px", maxWidth:"20px",width: "fit-content", marginLeft: '1px'}}>
                    <SendIcon style={{color:theme.palette.primary.main}}/>
                </Button>

            </Box>
        </>
    );
};

export default ChatInput;
