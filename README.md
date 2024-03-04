# DL-Extractor

This is an app that allows the users to extract information from his/her Driver's License in a user-friendly way.

# Start the project

Before you proceed, make sure that you have [Node](https://nodejs.org/en) installed in your computer.

Clone this repository, then install the packages by running this command in your terminal:

### `npm i`

After that, run this command to start the Vite server:

### `npm run dev`

Vite will give you a link to spin up the web app in your browser. Open the url in your browser and you are good to go.

# Libraries/Technologies Used

This project is created using [Vite](https://vitejs.dev/) and uses following libraries as dependencies:
[@material-tailwind/react](https://www.npmjs.com/package/@material-tailwind/react)
[react-router-dom](https://www.npmjs.com/package/react-router-dom)
[react-webcam](https://www.npmjs.com/package/react-webcam)
[tesseract.js](https://www.npmjs.com/package/tesseract.js)

# Process To Extract Data

In order to extract data, this app is first processing the image using various techniques (which can be found in utils/preprocessImage.jsx) to make the text in the image more readable for the OCR (Optical Character Recognition) library and remove noise for better results. After that [tesseract.js](https://www.npmjs.com/package/tesseract.js) is being used to extract data from the processed image. The extracted data is then sent to a function (which can be found in utils/parseData.jsx) that processes the data and remove a few impurities for better results. Finally the parsed data is sent to Data.jsx component to display it to the end user.

# Steps in Preprocessing the Image

Note: The code for preprocessing the image can be found in utils/preprocessImage.jsx

Step 1. Image Loading: The function loads the image specified by imageSrc using the Image constructor.

Step 2. Canvas Initialization: It creates a canvas element and gets a 2D rendering context.

Step 3. Resizing Image: The resizeImage function resizes the image to fit within specified dimensions while preserving its aspect ratio.

Step 4. Image Data Retrieval: It retrieves the image data from the canvas using ctx.getImageData().

Step 5. Image Data Preprocessing: The preprocessImageData function applies preprocessing steps to the image data, such as blurring and thresholding.

Step 6. Canvas Update: It puts the preprocessed image data back onto the canvas using ctx.putImageData().

Step 7. Blob Conversion: Finally, the canvas is converted to a Blob object representing the preprocessed image, and the Promise is resolved with this Blob.

# Preprocessing Techniques Used

Blurring: A light blur is applied to the image data to reduce noise and smooth out irregularities. This helps improve the clarity of the text in the image, making it easier for OCR algorithms to recognize characters.

Thresholding (Otsu's Method): Otsu's thresholding algorithm is utilized to convert the grayscale image into a binary image. This technique automatically determines the optimal threshold value based on the image's histogram, resulting in a clear contrast between the text and the background.

# Extracting the Data

Note: The code for extracting the data can be found in utils/useParseImage.jsx. This hook is designed to perform these steps:

Image Processing: The hook preprocesses the image using the preprocessImage utility function to enhance its quality for OCR.

Text Recognition: It utilizes Tesseract.js to recognize text from the preprocessed image.

Data Parsing: The extracted text is parsed using the parseData utility function to organize it into structured data.

Navigation: Upon successful parsing, the hook navigates to the specified route (/data) with the parsed data and original image source.

Error Handling: If any errors occur during the OCR process, an error message is displayed.

# Parsing the extracted data

Note: The code for parsing the extracted data can be found in utils/preprocessImage.jsx

Correction Patterns: The function defines an array of patterns to identify and correct common OCR errors and impurities found in driver's license text.

Text Correction: It iterates through each correction pattern and applies the specified replacement to the OCR text.

Line Structure Preservation: After applying corrections, the function ensures that the line structure is preserved by removing extra whitespace, collapsing multiple spaces into one, and trimming each line.

Empty Line Removal: Any empty lines resulting from the correction process are removed to maintain text consistency.

# Problems faced while developing this

I faced two major problems while developing this application:

Preprocessing the image - [tesseract.js](https://www.npmjs.com/package/tesseract.js) library wasn't accurate with the data it was extracting due to noise in the image and so much colors present. Accuracy was reduced even more because of the fact that the browser is not as capable as a server and has less resources to spare, which affected the processing capabilities of the OCR library. To tackle this problem, a function that could somehow reduce noise as much as possible along with making the text appear more readable for the library to extract it more accurately. Making this function was very tough since a lot of research was required to find the right method of binarization (Otsu Thresholding in my case) and finding the right processing techniques that enhance the readability of the image in a positive way.
Parsing the extracted text - Even after preprocessing the image and using custom options during OCR to enhance its capabilities, there were still many impurities in the extracted text. In order to solve this, I used regex to find common errors and replaced them with the correct text. 

# Notes

When capturing the photo of your Driver's License, keep these points in mind: 

- Keep your hand still while clicking on the capture button.
- Place the Driver's License as close as you can to the camera for better readability.
- Try again if you think the data extracted is wrong.

# Credits 

This utility was developed by [Sasnarine Deodat](https://github.com/SasnarineDeodat).