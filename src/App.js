import './App.css';
import add from './images/add.png'
import React, {useState} from "react";
import heic2any from "heic2any";
import loading from "./images/loading.gif"
import axios from "axios";

function App() {

    const [photo, setPhoto] = useState(add);
    const [file, setFile] = useState();
    const [cla, setCla] = useState("addButton")
    const [btn, setBtn] = useState("uploadButton")

    const extensions = ["jpg", "heic", "png", "jpeg", "heif"]

    function handleChange(e) {
        if (e.target.files[0] === undefined)
            return;
        if (!(extensions.some(i => e.target.files[0].name.includes(i)))){
            setPhoto(add)
            setCla("addButton")
            return;
        }


        if (e.target.files[0].name.includes("heic")) {
            setPhoto(loading)
            setCla("photo")
            setBtn("waitingBtn")
            const blob = e.target.files[0]
            heic2any({
                blob: blob,
                toType: "image/jpg",
                quality: 0.5,
                multiple: false
            }).then(function (result) {
                setPhoto(URL.createObjectURL(result))
                setBtn("uploadButton")
                setFile(e.target.files[0])
            }).catch(e=> console.log(e))
            return
        }
        setCla("photo");
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0])
    }

    function submit() {
        if(btn === "waitingBtn")
            return
        if(file === undefined)
            return;
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "daqhxqqe")
        axios.post("https://api.cloudinary.com/v1_1/dap2yqjmx/image/upload", formData).then().catch(e => console.log(e))

        setPhoto(add)
        setCla("addButton")
    }

    return (
        <div className="App">
            <div className="uploadBox">
                <input className="inputFile" type="file" name="file" id="file" onChange={handleChange}/>
                <label htmlFor="file"><img className={cla} src={photo}/></label>
            </div>
            <div className="center">
                <button className={btn} onClick={submit}>Odeslat</button>
            </div>
        </div>
    );
}

export default App;
