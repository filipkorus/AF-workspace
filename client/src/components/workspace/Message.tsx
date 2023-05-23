import React from 'react';
import theme from "../../utils/theme";
import {Box} from '@mui/material';

const Message = ({content, timestamp, name, isMyMessage, grayMessage}: {
	content: string,
	timestamp: string,
	name: string,
	isMyMessage: boolean,
	grayMessage?: boolean
}) => {
	return <Box style={{
		backgroundColor: grayMessage ? '#999999' : (isMyMessage ? theme.palette.secondary.main : theme.palette.primary.main),
		borderRadius: "10px",
		wordBreak: 'break-word',
		marginTop: "3px",
		marginRight: "3px",
		marginBottom: "5px",
		padding: "5px"
	}}>
		<div style={{fontSize: ".7rem", color: isMyMessage ? '' : 'whitesmoke'}}>{name}</div>
		{content}
		<div style={{fontSize: ".6rem", textAlign: "right", color: isMyMessage ? '' : 'whitesmoke'}}>{timestamp}</div>
	</Box>;
};

export default Message;
