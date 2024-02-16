import { useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCapture, captureImage }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  useEffect(() => {
    if (captureImage) {
      capture();
    }
  }, [captureImage]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        minScreenshotHeight={1200}
        minScreenshotWidth={1200}
      />
    </>
  );
};

export default WebcamCapture;
