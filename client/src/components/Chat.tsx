import {Socket} from 'socket.io-client';
import {Button} from '@mui/material';

const Chat = ({socket} : {socket :  Socket}) => <Button variant="contained" onClick={
	() => socket.emit('msg', 'hello from chat component')
}>chat</Button>;

export default Chat;
