import imageSrc from "../assets/test.jpg";
export default function preprocessImage() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure CORS policy compliance if necessary
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      resizeImage(img, canvas, ctx);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      preprocessImageData(imageData);

      ctx.putImageData(imageData, 0, 0);

      // Convert canvas to Blob and resolve promise
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => {
      reject(new Error("Image could not be loaded."));
    };
  });
}

function resizeImage(img, canvas, ctx) {
  const maxWidth = 2000; // Keep these dimensions or adjust based on your needs
  const maxHeight = 1800;
  let scaleFactor = 1;
  if (img.width > maxWidth || img.height > maxHeight) {
    scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
  }
  canvas.width = img.width * scaleFactor;
  canvas.height = img.height * scaleFactor;

  // Resize and draw the image on canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function preprocessImageData(imageData) {
  // Preprocessing steps
  // dynamicAdjustContrast(imageData);
  // blurARGB(imageData, 0); // Light blur to reduce noise
  // advancedSharpen(imageData); // Sharpen to enhance edges
  improvedAdaptiveThreshold(imageData, 100, 60); // Adaptive threshold for clear binary image
}

function advancedSharpen(imageData) {
  // Placeholder for an advanced sharpening algorithm
  const blurRadius = 0; // Smaller radius for a subtle effect
  const amount = 1; // Higher amount for more sharpening
  let blurredImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
  );
  blurARGB(blurredImageData, blurRadius); // Apply blur for the unsharp mask

  // Unsharp mask: subtract the blurred image from the original
  for (let i = 0; i < imageData.data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      let originalVal = imageData.data[i + channel];
      let blurredVal = blurredImageData.data[i + channel];
      let newVal = originalVal + (originalVal - blurredVal) * amount;
      imageData.data[i + channel] = Math.min(255, Math.max(0, newVal));
    }
  }
}

function improvedAdaptiveThreshold(imageData, blockSize = 9, C = 5) {
  const width = imageData.width,
    height = imageData.height;
  const halfBlockSize = Math.floor(blockSize / 2);
  let sumMatrix = buildIntegralImage(imageData);

  // Loop through each pixel in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate the bounds of the block
      let x1 = Math.max(0, x - halfBlockSize);
      let y1 = Math.max(0, y - halfBlockSize);
      let x2 = Math.min(width - 1, x + halfBlockSize);
      let y2 = Math.min(height - 1, y + halfBlockSize);

      // Correct for integral image index (start from 1,1 due to how integral is calculated)
      let count = (x2 - x1 + 1) * (y2 - y1 + 1);
      let sum =
        sumMatrix[y2 + 1][x2 + 1] -
        sumMatrix[y1][x2 + 1] -
        sumMatrix[y2 + 1][x1] +
        sumMatrix[y1][x1];

      // Calculate the threshold and apply it
      let index = (y * width + x) * 4;
      let brightness =
        0.299 * imageData.data[index] +
        0.587 * imageData.data[index + 1] +
        0.114 * imageData.data[index + 2];
      let threshold = sum / count - C;

      if (brightness < threshold) {
        imageData.data[index] =
          imageData.data[index + 1] =
          imageData.data[index + 2] =
            0;
      } else {
        imageData.data[index] =
          imageData.data[index + 1] =
          imageData.data[index + 2] =
            255;
      }
      imageData.data[index + 3] = 255; // Ensure full opacity for alpha channel
    }
  }
}

function buildIntegralImage(imageData) {
  const width = imageData.width,
    height = imageData.height;
  let integralImage = Array.from({ length: height + 1 }, () =>
    new Array(width + 1).fill(0),
  );

  // Compute the integral image
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let index = ((y - 1) * width + (x - 1)) * 4;
      let brightness =
        0.299 * imageData.data[index] +
        0.587 * imageData.data[index + 1] +
        0.114 * imageData.data[index + 2];
      integralImage[y][x] =
        brightness +
        integralImage[y - 1][x] +
        integralImage[y][x - 1] -
        integralImage[y - 1][x - 1];
    }
  }
  return integralImage;
}

function dynamicAdjustContrast(imageData) {
  let pixels = imageData.data;
  let max = 0,
    min = 255;

  // Find the max and min brightness values
  for (let i = 0; i < pixels.length; i += 10) {
    let brightness =
      0.34 * pixels[i] + 0.5 * pixels[i + 1] + 0.16 * pixels[i + 2]; // Rough approximation
    max = brightness > max ? brightness : max;
    min = brightness < min ? brightness : min;
  }

  // Apply contrast adjustment
  for (let i = 0; i < pixels.length; i += 10) {
    pixels[i] = (pixels[i] - min) * (255 / (max - min)); // Red
    pixels[i + 1] = (pixels[i + 1] - min) * (255 / (max - min)); // Green
    pixels[i + 2] = (pixels[i + 2] - min) * (255 / (max - min)); // Blue
  }
}

function blurARGB(imageData, radius) {
  const width = imageData.width;
  const height = imageData.height;
  // Ensure kernelSize is positive and an odd number to symmetrically blur around the center pixel
  const kernelSize = Math.max(1, 2 * radius + 1);
  const kernel = new Array(kernelSize).fill(1); // Using a simple box blur kernel for illustration
  const kernelSum = kernel.reduce((a, b) => a + b, 0);

  // Temporary arrays to hold the blur results
  const tempPixels = new Uint8ClampedArray(imageData.data.length);
  const resultPixels = new Uint8ClampedArray(imageData.data.length);

  // Horizontal blur pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let i = -radius; i <= radius; i++) {
        const safeX = Math.max(0, Math.min(x + i, width - 1));
        const idx = (y * width + safeX) * 4;
        r += imageData.data[idx];
        g += imageData.data[idx + 1];
        b += imageData.data[idx + 2];
        a += imageData.data[idx + 3];
      }
      const destIdx = (y * width + x) * 4;
      tempPixels[destIdx] = r / kernelSum;
      tempPixels[destIdx + 1] = g / kernelSum;
      tempPixels[destIdx + 2] = b / kernelSum;
      tempPixels[destIdx + 3] = a / kernelSum;
    }
  }

  // Vertical blur pass
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let i = -radius; i <= radius; i++) {
        const safeY = Math.max(0, Math.min(y + i, height - 1));
        const idx = (safeY * width + x) * 4;
        r += tempPixels[idx];
        g += tempPixels[idx + 1];
        b += tempPixels[idx + 2];
        a += tempPixels[idx + 3];
      }
      const destIdx = (y * width + x) * 4;
      resultPixels[destIdx] = r / kernelSum;
      resultPixels[destIdx + 1] = g / kernelSum;
      resultPixels[destIdx + 2] = b / kernelSum;
      resultPixels[destIdx + 3] = a / kernelSum;
    }
  }

  // Copy the blurred result back into the original imageData object
  for (let i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = resultPixels[i];
  }
}
