import React, {useCallback, useEffect, useRef} from 'react';
import {LinearProgress} from '@mui/material';
import {useSocket} from '../../contexts/SocketContext';
import Quill, {DeltaOperation} from 'quill';
import 'quill/dist/quill.snow.css';
import '../../styles/QuillEditor.css';
import {useParams} from 'react-router-dom';

const QuillEditor = () => {
    const quill = useRef<any>(null);
    const documentLoaded = useRef<boolean>(false);
    const {socket, isConnected}: any = useSocket();
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

                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                    [{'direction': 'rtl'}],                         // text direction

                    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                    [{'font': []}],
                    [{'align': []}],
                ]
            },
            placeholder: "What's on your mind?",
            theme: "snow"
        };
        quill.current = new Quill(editor, options);
        quill.current.disable();
        quill.current.setText('Loading content...');
    }, []);

    useEffect(() => {
        if (!documentLoaded.current) return;

        quill.current.enable(isConnected);
        quill.current.focus();
    }, [isConnected]);

    useEffect(() => {
        if (socket == null || quill.current == null) return;

        socket.once('load-document', (document: DeltaOperation) => {
            quill.current.setContents(document);
            quill.current.enable();
            documentLoaded.current = true;
        });

        socket.volatile.emit('get-document', workspaceId);
    }, [socket, quill.current, isConnected, workspaceId]);

    useEffect(() => {
        if (socket == null || quill.current == null) return;

        const interval = setInterval(() => {
            socket.emit('save-document', quill.current.getContents());
        }, SAVE_DOCUMENT_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill.current]);

    /* emitting changes */
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
    }, [socket, quill.current]);

    /* receiving changes */
    useEffect(() => {
        if (socket == null || quill.current == null) return;

        const handler =  (delta: DeltaOperation) => {
            quill.current.updateContents(delta);
        };

        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes', handler);
        };
    }, [socket, quill.current]);

    return <>
        {!isConnected && <LinearProgress color="secondary"/>}
        <div
            ref={wrapperRef}
            className='bg-whitesmoke'
        ></div>
    </>;
}

export default QuillEditor;
