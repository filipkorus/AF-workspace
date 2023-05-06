import React from 'react';
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "JPG","PDF","DOCX","TXT"];

const DragnDrop = () => {
    const [file, setFile] = useState<File[] | null>(null); // add type annotation
    const handleChange = (file: File[]) => { // add type annotation
        setFile(file);
    };

    return (
        <div>
            <FileUploader
                style={{ backgroundColor:"blue",width:"100px",maxWidth:"100px"}}
                label=" "
               // multiple={true}
                handleChange={handleChange}
                name="file"
                types={fileTypes}
            />
            <p style={{fontSize: ".8rem",color:"gray"}}>{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p>
        </div>

    );
};

export default DragnDrop;
