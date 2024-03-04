export default function cleanDriverLicenseOCRText(ocrText) {
  // Define patterns to remove common OCR noise and impurities across various states
  const patternsToCorrect = [
    { remove: /.*oL/gi, add: 'DL' }, // Correct "oL" to "DL"
    { remove: /CLASs/gi, add: 'CLASS' }, // Correct "CLASs" to "CLASS"
    { remove: /.*exp/gi, add: 'EXPIRATION DATE' }, // Correct "dg N exp" to "EXP"
    { remove: /.*LNCARDHOLDER/gi, add: '' }, // Remove ", LNCARDHOLDER"
    { remove: /MMos/gi, add: 'DOB' }, // Correct "MMos" to "DOB"
    { remove: /.*Mos/gi, add: 'DOB' }, // Correct "MMos" to "DOB"
    { remove: /ARN i -/gi, add: 'DONOR' }, // Correct "ARN i -" to "DONOR"
    { remove: /.*VETERAN/gi, add: 'VETERAN' }, // Correct "so VETERAN" to "VETERAN"
    { remove: /SEX F.*/gi, add: 'SEX F' }, // Remove everything from "SEX F" to "ISS"
    { remove: /SEX M.*/gi, add: 'SEX M' },
    { remove: /.*FN/gi, add: "Full Name" }, // Replace 'FN' with 'Full Name'
    { remove: /.*EYES.*/gi, add: ""},
    { remove: /.*(iss|ISS|bss|1ss).*/gi, add: "Issue Date" },
    { remove: /TOORVE/gi, add: "" },
    { remove: /TO DRIVE/gi, add: "" },
    { remove: /TODRIVE/gi, add: "" },
    { remove: /.*ANFD\/YY /gi, add: "" }
  ];

  let cleanedText = ocrText;

  // Apply corrections
  patternsToCorrect.forEach(({ remove, add }) => {
    cleanedText = cleanedText.replace(remove, add);
  });

  // Correct common OCR errors without altering line structure
  cleanedText = cleanedText
    .split('\n')
    .map(line => line.replace(/[\s]+/g, ' ').trim()) // Collapse multiple spaces into one and trim
    .filter(line => line) // Remove empty lines
    .join('\n');

  return cleanedText;
}