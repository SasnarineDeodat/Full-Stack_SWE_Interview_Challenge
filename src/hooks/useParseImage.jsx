import { createWorker, PSM } from "tesseract.js";
import { useState } from "react";
import preprocessImage from "../utils/preprocessImage";

export default function useParseImage(imageSrc) {
  const [text, setText] = useState("");
  if (!imageSrc) {
    return "";
  }
  (async () => {
    const processedImage = await preprocessImage(imageSrc);
    const imageUrl = URL.createObjectURL(processedImage);
    const imgTag = document.createElement("img");
    imgTag.src = imageUrl;
    document.body.appendChild(imgTag);
    const worker = await createWorker("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ,/",
    });
    const ret = await worker.recognize(imageUrl);
    console.log(ret.data.text);
    await worker.terminate();
  })();
}
