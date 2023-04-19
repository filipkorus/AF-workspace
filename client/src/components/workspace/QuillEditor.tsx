import React, {useCallback, useEffect, useRef} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../../styles/QuillEditor.css"
import {LinearProgress} from '@mui/material';

const QuillEditor = ({disabled}: { disabled: boolean }) => {
    const quill = useRef<any>(null);

    const wrapperRef = useCallback((wrapper: any) => {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div');
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
        quill.current = new Quill(editor, options)
    }, [])

    useEffect(() => {
        quill.current.enable(!disabled);
    }, [disabled]);

    return <>
        {disabled && <LinearProgress color="secondary" sx={{width: '99%'}}/>}
        <div
            id="container"
            ref={wrapperRef}
            style={{
                //height: "calc(100%-42px)",
                height: "auto",
                maxHeight: "99%", //rozmiar kartki tej biales
                width: '99%',
                margin: 0,
                backgroundColor: 'whitesmoke',


            }}
        ></div>
    </>;
}

export default QuillEditor;
