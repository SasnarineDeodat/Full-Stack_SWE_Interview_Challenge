import { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import WebcamCapture from "./WebcamCapture";

export default function DialogBox({ open, handleOpen }) {
  const [captureImage, setCaptureImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const handleCapture = (imageSrc) => {
    console.log(imageSrc);
    setImageSrc(imageSrc);
  };
  return (
    <div>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="dark:bg-stone-900 dark:text-white text-stone-900"
      >
        <DialogHeader className="font-bold">
          Scan Your Driver's License
        </DialogHeader>
        <DialogBody className="font-semibold overflow-y-auto">
          Put your Driver's License in front of the camera and click on the
          Capture button to extract all the details.
          <div className="flex items-center flex-col mt-5">
            {!imageSrc ? (
              <WebcamCapture
                onCapture={handleCapture}
                captureImage={captureImage}
              />
            ) : (
              <img src={imageSrc} alt="DL Extractor" />
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1 text-red-400"
          >
            <span>Cancel</span>
          </Button>
          <Button
            className="py-1 px-6 w-fit text-white font-semibold text-lg bg-blue-500 rounded-md transition-all duration-300 hover:bg-blue-400 capitalize"
            data-ripple-light="true"
            data-dialog-target="animated-dialog"
            onClick={() => setCaptureImage(true)}
            disabled={imageSrc ? true : false}
          >
            <span>{imageSrc ? "Loading..." : "Capture"}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
