import {useEffect, useState} from "react";
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";

function App() {
    const [link, setLink] = useState("")

    const handleOnChange = async (event) => {
        const files = event.target.files;
        console.log(files);

        const ffmpeg = createFFmpeg({
            mainName: 'main',
            corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
        });

        await ffmpeg.load()

        const {name} = files[0]

        const file = await fetchFile(files[0])

        ffmpeg.FS('writeFile', name, file)

        const fileName = name.split('.').slice(0, -1).join('.')

        await ffmpeg.run('-i', name, "-c:v", "copy", "-c:a", "libmp3lame", "-q:a", "4", fileName+'.mp3')

        const data = ffmpeg.FS('readFile', 'output.mp3')

        const url = URL.createObjectURL(new Blob([data.buffer], {type: 'audio/mp3'}))

        const player = document.getElementById('player')
        player.src = url

        setLink(url)
    }


    return (
        <div className="App">
            <div style={{
                display: "flex",
                justifyContent: 'center',
                marginBottom: "1rem",
                alignItems: 'center',
                flexDirection: "column"
            }}>
                <h1>Convert M4A to MP3</h1>
                <h2>Powered By WASM</h2>
                <p>It convert audio file in client side</p>
                <p>Apple, Please Fix</p>
            </div>
            <div style={{
                display: "flex",
                justifyContent: 'center',
                marginBottom: "1rem",
                alignItems: 'center',
                flexDirection: "column"
            }}>
                <input type={"file"} accept={"audio/x-m4a"} onChange={handleOnChange}></input>
                <audio id={"player"} controls></audio>
            </div>
            <div style={{
                display: "flex",
                justifyContent: 'center',
                marginBottom: '1rem',
                alignItems: 'center',
                flexDirection: "column"
            }}>
                {link && <a href={link} download={"audio.mp3"}>Download</a>}
            </div>


        </div>
    );
}

export default App;
