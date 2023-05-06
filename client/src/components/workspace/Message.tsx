import React from 'react';
import theme from "../../utils/theme";

const Message = ({content, timestamp, name, isMyMessage}: any) => {
    return (
        <div style={{
            backgroundColor: isMyMessage ? theme.palette.secondary.main : theme.palette.primary.main,
            borderRadius: "10px",
            wordBreak: 'break-word',
            marginTop: "3px",
            marginRight: "3px",
            marginBottom: "5px",
            padding: "5px"
        }}>
            <div style={{fontSize: ".7rem", color: isMyMessage || 'whitesmoke'}}>{name}</div>
            {content}
            <div style={{fontSize: ".6rem", textAlign: "right", color: isMyMessage || 'whitesmoke'}}>{timestamp}</div>
        </div>

    );
};

export default Message;