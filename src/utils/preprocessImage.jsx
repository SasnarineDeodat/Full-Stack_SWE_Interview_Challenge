import cv from "@techstark/opencv-js";
export default async function preprocessImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.crossOrigin = "Anonymous";
    imgElement.src = imageSrc;
    imgElement.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Assuming the target DPI is 300 and the image size corresponds to a standard ID size,
      // calculate the scaling factor to simulate this DPI.
      const dpiScalingFactor = calculateDpiScalingFactor(imgElement, 300);
      canvas.width = imgElement.width * dpiScalingFactor;
      canvas.height = imgElement.height * dpiScalingFactor;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      let srcMat = cv.imread(canvas);
      let grayMat = new cv.Mat();
      cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);

      // Noise reduction while preserving edges
      let bilateralFilterMat = new cv.Mat();
      cv.bilateralFilter(
        grayMat,
        bilateralFilterMat,
        9,
        75,
        75,
        cv.BORDER_DEFAULT,
      );

      // Enhanced Sharpening
      let laplacianMat = new cv.Mat();
      cv.Laplacian(
        bilateralFilterMat,
        laplacianMat,
        cv.CV_8U,
        1,
        1,
        0,
        cv.BORDER_DEFAULT,
      );
      let sharpMat = new cv.Mat();
      cv.addWeighted(
        bilateralFilterMat,
        1.75,
        laplacianMat,
        -0.75,
        0,
        sharpMat,
      );

      // Further Text Clarity Enhancement
      let thresholdMat = new cv.Mat();
      cv.threshold(
        sharpMat,
        thresholdMat,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU,
      );

      // Optional: Apply slight erosion to make text sharper
      let textEnhancedMat = new cv.Mat();
      const kernel = cv.Mat.ones(1, 2, cv.CV_8U); // Small kernel for minimal erosion
      cv.erode(thresholdMat, textEnhancedMat, kernel);

      cv.imshow(canvas, textEnhancedMat); // Display the enhanced text image

      // Convert canvas to Blob for OCR processing
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");

      // Cleanup
      srcMat.delete();
      grayMat.delete();
      bilateralFilterMat.delete();
      laplacianMat.delete();
      sharpMat.delete();
      thresholdMat.delete();
      textEnhancedMat.delete();
      kernel.delete();
    };
    imgElement.onerror = () => reject(new Error("Image could not be loaded."));
  });
}

function calculateDpiScalingFactor(imgElement, targetDpi) {
  const standardPrintWidthInches = 3.375; // Example for a driver's license or ID card width
  const requiredPixelWidth = standardPrintWidthInches * targetDpi;
  return requiredPixelWidth / imgElement.width; // Scaling factor to simulate target DPI
}
