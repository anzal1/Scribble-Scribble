import * as React from "react";
import { useEffect, useRef, useCallback, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {
  Undo as UndoIcon,
  Trash as TrashIcon,
  Camera as CameraIcon,
  X as CloseIcon,
  File as FileIcon,
  ClipboardX as DiscardIcon,
} from "lucide-react";
import Webcam from "react-webcam";

export default function Canvas({
  startingPaths,
  onScribble,
  scribbleExists,
  setScribbleExists,
}) {
  const canvasRef = useRef(null);
  const webCamRef = useRef(null);
  const inputFileRef = useRef(null);

  const [showCamera, setShowCamera] = React.useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webCamRef.current.getScreenshot();
    setImageUrl(imageSrc);
    setShowCamera(false);
    onScribble(imageSrc);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        onScribble(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  useEffect(() => {
    // Hack to work around Firfox bug in react-sketch-canvas
    // https://github.com/vinothpandian/react-sketch-canvas/issues/54
    if (showCamera || imageUrl !== null) return;
    setShowCamera(false);
    document
      .querySelector("#react-sketch-canvas__stroke-group-0")
      ?.removeAttribute("mask");

    loadStartingPaths();
  }, [showCamera,imageUrl]);

  async function loadStartingPaths() {
    await canvasRef.current.loadPaths(startingPaths);
    setScribbleExists(true);
    onChange();
  }

  const onChange = async () => {
    const paths = await canvasRef.current.exportPaths();
    localStorage.setItem("paths", JSON.stringify(paths, null, 2));

    if (!paths.length) return;

    setScribbleExists(true);

    const data = await canvasRef.current.exportImage("png");
    console.log("data", data);
    onScribble(data);
  };

  const undo = () => {
    canvasRef.current.undo();
  };

  const reset = () => {
    setScribbleExists(false);
    canvasRef.current.resetCanvas();
  };

  return (
    <div className="relative">
      {scribbleExists || (
        <div>
          <div className="absolute grid w-full h-full p-3 place-items-center pointer-events-none text-xl">
            <span className="opacity-40">Draw something here.</span>
          </div>
        </div>
      )}
      {!showCamera && imageUrl === null && (
        <ReactSketchCanvas
          ref={canvasRef}
          className="w-full aspect-square border-none cursor-crosshair"
          strokeWidth={4}
          strokeColor="black"
          onChange={onChange}
          withTimestamp={true}
        />
      )}
      {showCamera && imageUrl === null && (
        <div className="aspect-square border-none cursor-crosshair">
          <Webcam
            audio={false}
            ref={webCamRef}
            screenshotFormat="image/png"
            videoConstraints={{
              facingMode: "environment",
            }}
          />
        </div>
      )}

      {!showCamera && imageUrl !== null && (
        <div className="aspect-square border-none cursor-crosshair">
          <img src={imageUrl} alt="webcam" />
        </div>
      )}

      <div className="animate-in fade-in duration-700 text-left">
        {scribbleExists && !showCamera && imageUrl === null && (
          <>
            <button className="lil-button" onClick={undo}>
              <UndoIcon className="icon" />
              Undo
            </button>
            <button className="lil-button" onClick={reset}>
              <TrashIcon className="icon" />
              Clear
            </button>
          </>
        )}
        {!showCamera && imageUrl === null && (
          <>
            <button
              className="lil-button"
              onClick={() => {
                setShowCamera(true);
              }}
            >
              <CameraIcon className="icon" />
              Take Photo
            </button>
            <button
              className="lil-button"
              onClick={() => {
                inputFileRef.current.click();
              }}
            >
              <FileIcon className="icon" type="file" />
              Upload Sketch
              <input
                ref={inputFileRef}
                type="file"
                style={{ display: "none" }}
                accept=".png"
                onChange={handleImageChange}
              />
            </button>
          </>
        )}

        {showCamera && (
          <>
            <button className="lil-button" onClick={capture}>
              <CameraIcon className="icon" />
              Capture Photo
            </button>
            <button className="lil-button" onClick={() => setShowCamera(false)}>
              <CloseIcon className="icon" />
              Cancel
            </button>
          </>
        )}

        {imageUrl !== null && (
          <>
            <button
              className="lil-button"
              onClick={() => {
                setImageUrl(null);
                setShowCamera(false);
              }}
            >
              <DiscardIcon className="icon" />
              Discard Image
            </button>
          </>
        )}
      </div>
    </div>
  );
}
