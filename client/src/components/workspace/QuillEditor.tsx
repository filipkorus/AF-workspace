import React, {useCallback, useEffect, useRef, useState} from 'react';
import {LinearProgress} from '@mui/material';
import {useSocket} from '../../contexts/SocketContext';
import Quill, {DeltaOperation} from 'quill';
import 'quill/dist/quill.snow.css';
import '../../styles/QuillEditor.css';
import {useParams} from 'react-router-dom';

const QuillEditor = () => {
    const [quill, setQuill] = useState<any>(null);
    const documentLoaded = useRef<boolean>(false);
    const {socket, isConnected, setIsRoomJoined, isRoomJoined}: any = useSocket();
    const {id: workspaceId}: any = useParams();
    const SAVE_DOCUMENT_INTERVAL_MS = 2000;

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
                    [{'font': []}],

                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'direction': 'rtl'}],                         // text direction

                    [{'color': []}, {'background': []}],          // dropdown with defaults from theme

                    [{'align': []}],
                ]
            },
            placeholder: "What's on your mind?",
            theme: "snow"
        };
        const q = new Quill(editor, options);
        setQuill(q)
        q.disable();
        q.setText('Loading content...');
    }, []);

    useEffect(() => {
        if (!documentLoaded.current || quill == null) return;

        quill.enable(isConnected);
        quill.focus();
    }, [quill, isConnected]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.once('load-document', (document: DeltaOperation) => {
            quill.setContents(document);
            quill.enable();
            documentLoaded.current = true;
            setIsRoomJoined(true);
        });

        socket.volatile.emit('get-document', workspaceId);
    }, [socket, quill, isConnected, workspaceId, setIsRoomJoined]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            if (!(isRoomJoined && isConnected && documentLoaded.current)) return;

            socket.emit('save-document', quill.getContents());
        }, SAVE_DOCUMENT_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    /* emitting changes */
    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler =  (delta: DeltaOperation, oldDelta: DeltaOperation, source: string) => {
            if (source !== 'user') return;
            socket.volatile.emit('send-changes', delta);
        };

        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler);
        };
    }, [socket, quill]);

    /* receiving changes */
    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler =  (delta: DeltaOperation) => {
            quill.updateContents(delta);
        };

        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes', handler);
        };
    }, [socket, quill]);

    return <>
        {!isConnected && <LinearProgress color="secondary"/>}
        <div
            ref={wrapperRef}
            className='bg-whitesmoke'
        ></div>
    </>;
}

export default QuillEditor;
