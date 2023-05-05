import React from 'react';
import theme from "../../utils/theme";

const Message = ({content, timestamp, name, messageId, isMyMessage}: any) => {
    return (
        <div style={{
            backgroundColor: isMyMessage ? theme.palette.secondary.main : theme.palette.primary.main,
            borderRadius: "10px",
            wordBreak: 'break-word',
            marginTop: "3px",
            marginRight: "3px",
            marginBottom: "5px",
            padding: "5px"
        }}
             key={messageId}>
            <div style={{fontSize: "12px"}}>{name}</div>
            {content}
            <div style={{color: "gray", fontSize: "10px", textAlign: "right"}}>{timestamp}</div>
        </div>

    );
};

export default Message;