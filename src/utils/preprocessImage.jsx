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

      // Sharpening with Unsharp Mask
      let unsharpMask = new cv.Mat();
      let ksize = new cv.Size(5, 5); // Consider smaller kernel for finer details
      cv.GaussianBlur(grayMat, blurredMat, ksize, 0, 0, cv.BORDER_DEFAULT);
      cv.addWeighted(grayMat, 1.5, blurredMat, -0.5, 0, unsharpMask); // Increase contrast in addWeighted for more sharpness

      // Apply Otsu's Thresholding
      cv.threshold(unsharpMask, thresholdMat, 0, 255, cv.THRESH_OTSU);

      // Making text bolder with careful morphological operations
      let morphMat = new cv.Mat();
      const M = cv.Mat.ones(1, 1, cv.CV_8U); // Use a very small structuring element
      cv.dilate(thresholdMat, morphMat, M, new cv.Point(-1, -1), 1); // Slight dilation to bolden text

      // Slight erosion to maintain clarity between characters
      let finalMat = new cv.Mat();
      cv.erode(morphMat, finalMat, M, new cv.Point(-1, -1), 1); // Adjust iteration count as needed

      cv.imshow(canvas, finalMat); // Display the processed image on the canvas

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
