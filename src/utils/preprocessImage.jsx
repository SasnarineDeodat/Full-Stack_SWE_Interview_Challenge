export default function preprocessImage(imageSrc) {
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
  let scaleFactor = 2;
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
  blurARGB(imageData, 1); // Light blur to reduce noise
  otsuThreshold(imageData); // Otsu threshold for clear binary image
}

function otsuThreshold(imageData) {
  const histogram = new Array(256).fill(0);
  const width = imageData.width;
  const height = imageData.height;
  let total = 0;

  // Step 1: Calculate histogram
  for (let i = 0; i < imageData.data.length; i += 4) {
    const brightness = Math.floor(
      0.299 * imageData.data[i] +
        0.587 * imageData.data[i + 1] +
        0.114 * imageData.data[i + 2],
    );
    histogram[brightness]++;
    total++;
  }

  // Step 2: Calculate total mean
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;

  // Step 3: Otsu's Threshold Calculation
  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    let mB = sumB / wB;
    let mF = (sum - sumB) / wF;

    // Calculate Between Class Variance
    let varBetween = wB * wF * (mB - mF) * (mB - mF);
    // Check if new maximum found
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = i;
    }
  }

  // Step 4: Apply Threshold
  for (let i = 0; i < imageData.data.length; i += 4) {
    const brightness =
      0.299 * imageData.data[i] +
      0.587 * imageData.data[i + 1] +
      0.114 * imageData.data[i + 2];
    let binarizedValue = brightness > threshold ? 255 : 0;
    imageData.data[i] =
      imageData.data[i + 1] =
      imageData.data[i + 2] =
        binarizedValue;
    imageData.data[i + 3] = 255; // Ensure full opacity for alpha channel
  }
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
