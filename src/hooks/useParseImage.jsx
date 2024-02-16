import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import preprocessImage from "../utils/preprocessImage";

export default function useParseImage(imageSrc) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!imageSrc) return;

    const processAndRecognizeImage = async () => {
      try {
        const processedImageBlob = await preprocessImage(imageSrc);
        const imageUrl = URL.createObjectURL(processedImageBlob);
        const imgTag = document.createElement("img");
        imgTag.src = imageUrl;
        document.body.appendChild(imgTag);
        const worker = await createWorker("eng");
        await worker.setParameters({
          tessedit_char_whitelist:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890 ,/-",
        });
        const ret = await worker.recognize(imageUrl);
        console.log(ret.data.text);
        await worker.terminate();
      } catch (error) {
        console.error("OCR processing failed:", error);
        setText("Error processing image");
      }
    };

    processAndRecognizeImage();
  }, [imageSrc]);

  return text;
}
