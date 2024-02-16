import { createWorker } from "tesseract.js";
import { useState } from "react";

export default function useParseImage(imageSrc) {
  const [text, setText] = useState("");
  if (!imageSrc) {
    return "";
  }
  (async () => {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(imageSrc);
    console.log(ret.data.text);
    await worker.terminate();
  })();
}
