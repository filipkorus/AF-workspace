import React from 'react';
import ChatInput from '../ChatInput';

const AIChat = () => {
	return (
		<div>
			<ChatInput handleSendMessage={(text) => console.log(text)} placeholder="Send a message"/>
		</div>
	);
};

export default AIChat;
