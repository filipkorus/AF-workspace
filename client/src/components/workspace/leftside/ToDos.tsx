import React, {useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import theme from "../../../utils/theme";
import {Button} from "@mui/material";
import {useSocket} from "../../../contexts/SocketContext";
import DeleteIcon from '@mui/icons-material/Delete';

const ToDos = () => {
    const {isConnected}: any = useSocket();
    const [list, setList] = useState<any>([]);
    const [myInput, setMyInput] = useState("");
    const [checked, setChecked] = useState(false);
    const handleCheckboxChange = (id: number) => {
        const newList = list.map((todo: any) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    checked: !todo.checked
                };
            }
            return todo;
        });
        setList(newList);
    }
    const handleAddTodo = () => {
        if (myInput.trim().length > 0) {
            const newTodo = {
                id: Math.random(),
                todo: myInput,
                checked: checked
            };
            setList((prevList: any) => [...prevList, newTodo]);
            setMyInput("");
            setChecked(false);
        }
    };
    // const addTodo = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //     if (event.key === 'Enter' && !event.shiftKey) {
    //         event.preventDefault();
    //         // const timestamp = Date.now().toLocaleString();
    //         if (myInput.length > 0) {
    //             handleSendMessage(myInput);
    //             setMyInput("");
    //         }
    //         const newTodo = {
    //             id: Math.random(),
    //             todo: myInput,
    //         };
    //         setList((prevList: any) => [...prevList, newTodo]);
    //         setMyInput("");
    //     }
    // }
    // const handleButtonClick = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     if (myInput.length > 0) {
    //         handleSendMessage(myInput);
    //         setMyInput("");
    //     }
    // }
    const deleteTodo = (id: number) => {
        const newList = list.filter((todo: any) => todo.id !== id);
        setList(newList);
    }

    return (
        <div>
            <div className="input-container" style={{display: "flex",justifyContent: "flex-end"}}>
      <textarea
          style={{
              padding: "5px",
              backgroundColor: "lavenderblush",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px"
          }}
          placeholder="Write sth..."
          rows={1}
          onChange={(e) => setMyInput(e.target.value)}
          value={myInput}
      />
                <Button className="sending" onClick={handleAddTodo} variant="contained" type="submit"
                        disabled={myInput.trim().length === 0}
                        style={{
                            padding: "1px",
                            display: "flex",
                            backgroundColor: "lavenderblush",
                            minWidth: "20px",
                            maxWidth: "25px",
                            width: "fit-content"
                        }}>
                    <AddIcon style={{color: theme.palette.primary.main}}/>
                </Button>
            </div>
            <div>
            <ul style={{
                justifyContent: "space-between",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                margin: "2px",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
                backgroundColor: theme.palette.secondary.main,
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
                width:"210px",
            }}>
                {list.map((todo: any) => (
                    <li key={todo.id} style={{ textDecoration: todo.checked ? "line-through" : "none",margin: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <input style={{accentColor:theme.palette.primary.main}} type="checkbox" checked={todo.checked} onChange={() => handleCheckboxChange(todo.id)} />
                            {todo.todo}
                        </div>
                        <button style={{ justifyContent:"space-between",width: "fit-content", backgroundColor: theme.palette.secondary.main, fontSize: "xx-small", marginRight: "1px"}} onClick={() => deleteTodo(todo.id)}>
                            <DeleteIcon />
                        </button>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
}
export default ToDos;