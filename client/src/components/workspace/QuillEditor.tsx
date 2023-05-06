import React, {useCallback, useEffect, useRef} from 'react';
import {LinearProgress} from '@mui/material';
import {useSocket} from '../../contexts/SocketContext';
import Quill, {DeltaOperation} from 'quill';
import 'quill/dist/quill.snow.css';
import '../../styles/QuillEditor.css';
import {useParams} from 'react-router-dom';

const QuillEditor = () => {
    const quill = useRef<any>(null);
    const {socket, isConnected, isWorkspaceJoined}: any = useSocket();

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
        quill.current.disable();
        quill.current.setText('Loading...');
    }, []);

    useEffect(() => {
        if (quill.current == null) return;
        if (quill.current.getText().startsWith('Loading...')) return;

        quill.current.enable(isConnected);
    }, [quill.current, isConnected]);

    useEffect(() => {
        if (socket == null || quill.current == null || !isWorkspaceJoined) return;

        socket.once('load-document', (document: string) => {
            console.log(document)
            quill.current.setText(document); // TODO: should be setContents instead of setText
            quill.current.enable();
        });

        socket.emit('get-document');
    }, [quill.current, socket, isWorkspaceJoined]);

    useEffect(() => {
        if (socket == null || quill.current == null) return;

        const handler =  (delta: DeltaOperation, oldDelta: DeltaOperation, source: string) => {
            if (source !== 'user') return;
            socket.volatile.emit('send-changes', delta);
        };

        quill.current.on('text-change', handler);

        return () => {
            quill.current.off('text-change', handler);
        };
    }, [quill.current, socket]);

    useEffect(() => {
        if (socket == null || quill.current == null) return;

        const handler =  (changes: DeltaOperation) => {
            quill.current.updateContents(changes);
        };

        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes', handler);
        };
    }, [quill.current, socket]);

    return <>
        {!isConnected && <LinearProgress color="secondary"/>}
        <div
            ref={wrapperRef}
            className='bg-whitesmoke'
        ></div>
    </>;
}

export default QuillEditor;
