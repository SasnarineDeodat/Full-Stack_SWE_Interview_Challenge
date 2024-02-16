import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import preprocessImage from "../utils/preprocessImage";
import { useNavigate } from "react-router-dom";
import parseData from "../utils/parseData";

export default function useParseImage(imageSrc, handleOpen) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!imageSrc) return;

    const processAndRecognizeImage = async () => {
      try {
        setLoading(true);
        const processedImageBlob = await preprocessImage(imageSrc);
        const imageUrl = URL.createObjectURL(processedImageBlob);
        const worker = await createWorker("eng");
        await worker.setParameters({
          tessedit_char_whitelist:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890 ,/-",
        });
        const ret = await worker.recognize(imageUrl);
        setText(ret.data.text);
        await worker.terminate();
        setLoading(false);
        handleOpen();
        const data = parseData(ret.data.text);
        navigate("/data", { state: { image: imageSrc, ...data } });
      } catch (error) {
        console.error("OCR processing failed:", error);
        setText("Error processing image");
      }
    };

    processAndRecognizeImage();
  }, [imageSrc]);

  return loading;
}
