import React, {useCallback} from "react";
import Quill,{ QuillOptionsStatic } from "quill";
import "quill/dist/quill.snow.css";

function QuillEditor() {
    const wrapperRef = useCallback((wrapper: any )=> {
        if (wrapper == null) return;

        wrapper.innerHTML = '';
        const editor = document.createElement('div')
        wrapper.append(editor);
        const options: QuillOptionsStatic = {
            modules: {
                toolbar: [
                    [{ header: [1, 2,3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["link", "image"],
                    ["clean"],
                ],
            },
            theme: "snow",
        };
        new Quill(editor, options)

    }, [])

    return <div id="container" ref={wrapperRef}></div>
}

export default QuillEditor;
