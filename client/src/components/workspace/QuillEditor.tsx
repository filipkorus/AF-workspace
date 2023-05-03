import React, {LegacyRef, useCallback, useEffect, useRef} from 'react';
import {LinearProgress} from '@mui/material';
import {useSocket} from '../../contexts/SocketContext';
import Quill, {DeltaOperation} from 'quill';
import 'quill/dist/quill.snow.css';
import '../../styles/QuillEditor.css';

const QuillEditor = () => {
    const quill = useRef<any>(null);
    const {socket, isConnected}: any = useSocket();

    const wrapperRef = useCallback((wrapper: any) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';

        const editor = document.createElement('div');
        editor.classList.add('quill-editor');
        wrapper.append(editor);

        const options = {
            modules: {
                toolbar: [
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],

                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'direction': 'rtl'}],                         // text direction

                    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                    [{'font': []}],
                    [{'align': []}],
                ],
            },
            placeholder: "What's on your mind?",
            theme: "snow"
        };
        quill.current = new Quill(editor, options);
    }, []);

    useEffect(() => {
        quill.current.enable(isConnected);
        quill.current.focus();
    }, [isConnected]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler =  (delta: DeltaOperation, oldDelta: DeltaOperation, source: string) => {
            if (source !== 'user') return;
            socket.volatile.emit('msg', delta);
        };

        quill.current.on('text-change', handler);

        return () => {
            quill.current.off('text-change', handler);
        };
    }, [quill.current]);

    return <>
        {!isConnected && <LinearProgress color="secondary"/>}
        <div
            ref={wrapperRef}
            className='bg-whitesmoke'
        ></div>
    </>;
}

export default QuillEditor;
