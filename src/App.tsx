import React from 'react';
import ImageUploader from "react-images-upload";
import './App.css';
import { Button } from '@mui/material';
import { buildInputFile, execute, loadImageElement } from 'wasm-imagemagick';

function App() {

  const [picture, setPicture] = React.useState<[File, string] | null>(null)
  const onDrop = (pictureFiles: File[], pictureDataURLs: string[]) => {
    setPicture([pictureFiles[0], pictureDataURLs[0]]);
  };
  const convert = async () => {
    if (!picture)
      return;
    const inputFile = await buildInputFile(picture[1], 'input.jpg');
    const { outputFiles, exitCode } = await execute({
      inputFiles: [inputFile],
      commands: 'convert input.jpg -compress none out.ppm',
    });
    const output = outputFiles[0];
    // download the file
    // const blob = new Blob([output.data], { type: 'image/ppm' });
    const blob = output.blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'out.ppm';
    a.click();
  };

  return (
    <div className="App">
      <ImageUploader
        withIcon={false}
        withPreview={true}
        buttonText="Choose images"
        onChange={onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif", ".webp"]}
        maxFileSize={5242880}
      />

      <Button variant="contained" color="primary" onClick={convert} disabled={!picture}>
        Convert to PPM
      </Button>
    </div>
  );
}

export default App;
