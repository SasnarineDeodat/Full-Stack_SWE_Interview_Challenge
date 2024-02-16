import imageSrc from "../assets/test.jpg";
import cv, { resize } from "@techstark/opencv-js";

async function preprocessImage() {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.crossOrigin = "Anonymous"; // Ensure CORS policy compliance if necessary
    imgElement.src = imageSrc;
    imgElement.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      let srcMat = cv.imread(canvas);
      let resizedMat = resizeImage(srcMat, 1200);
      let grayMat = new cv.Mat();
      let blurredMat = new cv.Mat();
      let thresholdMat = new cv.Mat();

      // Convert to Grayscale
      cv.cvtColor(resizedMat, grayMat, cv.COLOR_RGBA2GRAY);

      // Apply Gaussian Blur
      // cv.GaussianBlur(grayMat, blurredMat, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

      // Apply Otsu's Thresholding
      cv.threshold(grayMat, thresholdMat, 0, 255, cv.THRESH_OTSU);

      let morphMat = new cv.Mat();
      const M = cv.Mat.ones(2, 2, cv.CV_8U); // Smaller structuring element
      const anchor = new cv.Point(-1, -1);

      // Apply morphological opening to remove noise
      cv.erode(
        thresholdMat,
        morphMat,
        M,
        anchor,
        1,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );
      cv.dilate(
        morphMat,
        morphMat,
        M,
        anchor,
        1,
        cv.BORDER_CONSTANT,
        cv.morphologyDefaultBorderValue(),
      );

      // Optionally, apply morphological closing to close small holes within text, if necessary
      // cv.dilate(morphMat, morphMat, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      // cv.erode(morphMat, morphMat, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

      cv.imshow(canvas, morphMat); // Display the processed image on the canvas

      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");

      // Clean up
      srcMat.delete();
      resizedMat.delete();
      grayMat.delete();
      blurredMat.delete();
      thresholdMat.delete();
    };
    imgElement.onerror = () => {
      reject(new Error("Image could not be loaded."));
    };
  });
}

function resizeImage(srcMat, targetHeight) {
  const aspectRatio = srcMat.cols / srcMat.rows;
  let targetWidth;

  if (srcMat.rows > srcMat.cols) {
    targetWidth = Math.floor(targetHeight * aspectRatio);
  } else {
    targetWidth = targetHeight;
    targetHeight = Math.floor(targetWidth / aspectRatio);
  }

  let dsize = new cv.Size(targetWidth, targetHeight);
  let dst = new cv.Mat();
  cv.resize(srcMat, dst, dsize, 0, 0, cv.INTER_AREA);
  return dst;
}

export default preprocessImage;
