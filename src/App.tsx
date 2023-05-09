import React from 'react';
import ImageUploader from "react-images-upload";
import './App.css';
// import {useDropzone} from 'react-dropzone';
import { Button, Input } from '@mui/material';
import { buildInputFile, execute } from 'wasm-imagemagick';

function App() {

  let init_command = "convert %image -compress none out.ppm";
  const urlParams = new URLSearchParams(window.location.search);
  const command_param = urlParams.get('command');
  if (command_param) {
    init_command = command_param;
  }

  const [command, setCommand] = React.useState<string>(init_command);

  const [picture, setPicture] = React.useState<[File, string] | null>(null)
  const onDrop = (pictureFiles: File[], pictureDataURLs: string[]) => {
    setPicture([pictureFiles[0], pictureDataURLs[0]]);
  };
  const convert = async () => {
    if (!picture)
      return;
    const file_name = picture[0].name;
    const inputFile = await buildInputFile(picture[1], file_name);
    const { outputFiles } = await execute({
      inputFiles: [inputFile],
      commands: command.replace("%image", file_name),
    });
    const output = outputFiles[0];
    // set name to original file name + new extension
    const new_ext = output.name.split(".").pop();
    output.name = file_name.replace(/\.[^/.]+$/, "") + "." + new_ext;
    const blob = output.blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = output.name;
    a.click();
  };

  const image_uploader = (
      <ImageUploader
        withIcon={false}
        withPreview={true}
        buttonText="Choose images"
        onChange={onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif", ".webp"]}
        maxFileSize={5242880}
        singleImage={true}
      />
  );

  // const {acceptedFiles, getRootProps, getInputProps} = useDropzone();


  return (
    <div className="App">
      {image_uploader}
      <Button variant="contained" color="primary" onClick={convert} disabled={!picture}>
        Convert to PPM
      </Button>

      <br />

      <Input type="text" value={command} onChange={(e) => setCommand(e.target.value)} fullWidth />
    </div>
  );
}

export default App;
