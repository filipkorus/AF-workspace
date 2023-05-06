import React from 'react';
import {useDropzone} from "react-dropzone";
import theme from "../../../utils/theme";

const DragnDrop = () => {

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.name}>{file.name}</li>
    ));

    return (
        <>
            <section className="container">
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p  style={{color: theme.palette.primary.main,fontSize: "x-large", justifyContent: "center"}}>Click or drop here
                    </p>

                </div>
                <aside>
                    <ul style={{color: theme.palette.primary.main, paddingLeft: "8px", fontSize: "0.9rem"}}>{files}</ul>
                </aside>
            </section>

        </>

    );
};

export default DragnDrop;
