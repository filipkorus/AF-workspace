import React, {useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import theme from "../../../utils/theme";
const ToDos = () => {
    const [list, setList] = useState<any>([]);
    const [input, setInput] = useState("");

    const addTodo = (todo: string) => {
        const newTodo = {
            id: Math.random(),
            todo: todo,
        };
        setList((prevList:any)=>[...prevList, newTodo]);
        setInput("");

    }

    const deleteTodo = (id: number) => {
        const newList = list.filter((todo:any) => todo.id !== id);
        setList(newList);
    }

    return (
        <>
            {'\n'}
            <input type="text" value={input}
                   onChange={(e) => setInput(e.target.value)} />
            <br/>
            <br/>
            <br/>
            <button onClick={() => addTodo(input)}>
                <AddIcon style={{color:theme.palette.primary.main, backgroundColor:"white"}}/>
            </button>
            <ul>
                {list.map((todo: any) => (
                    <li key={todo.id}>

                        {todo.todo}
                        {/*usuwanie- przycisk*/}
                        <button onClick={() => deleteTodo(todo.id)} >&times;</button>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ToDos;