import React, {useState} from 'react';
import {Box, Button, css} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import theme from "../../utils/theme";
import {useSocket} from '../../contexts/SocketContext';
import { SxProps } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

const ChatInput = ({handleSubmit, addIcon, placeholder, rows, sx}: {
    handleSubmit: (text: string) => void,
    addIcon?: boolean,
    placeholder?: string,
    rows?: number,
    sx?: SxProps
}) => {
    const {isConnected}: any = useSocket();
    const [msg, setMsg] = useState("");
    const sendChat = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // const timestamp = Date.now().toLocaleString();
            if (msg.length > 0) {
                handleSubmit(msg);
                setMsg("");
            }
        }
    }
    const handleButtonClick = (e:React.MouseEvent) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSubmit(msg);
            setMsg("");
        }
    }

    return (
        <>
            <Box className="input-container" style={{ display: "flex",justifyContent:"space-between"}} sx={sx}>
                <textarea
                    style={{padding:"5px",marginLeft: "1px", backgroundColor: "lavenderblush",borderTopLeftRadius:"10px",borderBottomLeftRadius: "10px"}}
                    placeholder={placeholder || "Chat with your mates"}
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    onKeyDown={(event) => sendChat(event)}
                    rows={rows || 3}
                    wrap="soft"
                    aria-multiline={true}
                    disabled={!isConnected}
                />

                <Button className="sending" variant="contained" disabled={!isConnected} type="submit" onClick={handleButtonClick}
                        style={{backgroundColor: "lavenderblush",borderBottomRightRadius:"10px",borderTopRightRadius: "10px", maxWidth:"20px",width: "fit-content", marginLeft: '1px'}}>
                    {!addIcon && <SendIcon style={{color:theme.palette.primary.main}}/>}
                    {addIcon && <AddIcon style={{color: theme.palette.primary.main}}/>}
                </Button>

            </Box>
        </>
    );
};

export default ChatInput;
