export default function parseData(ocrText) {
  const data = {
    Name: null,
    DOB: null,
    Address: null,
    LicenseNumber: null,
    ExpiryDate: null,
  };

  const normalizedText = ocrText
    .replace(/[|]/g, "I")
    .replace(/DOB|D08/gi, "DOB")
    .replace(/EXP|EXPI/gi, "EXP")
    .replace(/DL|D[|]/gi, "DL");

  const lines = normalizedText.split("\n");

  const namePattern = new RegExp(
    "(?:LN|Name|Nama)[^\\w]*(\\w+),[^\\w]*(\\w+)",
    "i",
  );
  const dobPattern = new RegExp(
    "DOB[^\\w]*(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})",
    "i",
  );
  const addressPattern = new RegExp("(\\d{1,5}[^\\d\\n]+\\w{2}\\s\\d{5})", "i");
  const licenseNumberPattern = new RegExp("DL[^\\w]*([0-9a-zA-Z]+)", "i");
  const expiryDatePattern = new RegExp(
    "EXP[^\\w]*(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4})",
    "i",
  );

  lines.forEach((line) => {
    let match;

    if (!data.Name && (match = line.match(namePattern))) {
      data.Name = `${match[2]} ${match[1]}`;
    }

    if (!data.DOB && (match = line.match(dobPattern))) {
      data.DOB = match[1].replace(/[/-]/g, "/");
    }

    if (!data.Address && (match = line.match(addressPattern))) {
      data.Address = match[1].replace(/[\|]/g, "I");
    }

    if (!data.LicenseNumber && (match = line.match(licenseNumberPattern))) {
      data.LicenseNumber = match[1].replace(/[Oo]/g, "0").replace(/[Il]/g, "1");
    }

    if (!data.ExpiryDate && (match = line.match(expiryDatePattern))) {
      data.ExpiryDate = match[1].replace(/[/-]/g, "/");
    }
  });

  data.Name = cleanupName(data.Name);
  data.DOB = cleanupDate(data.DOB);
  data.ExpiryDate = cleanupDate(data.ExpiryDate);

  return data;
}

function cleanupName(name) {
  if (!name) return null;

  name = name
    .replace(/0/g, "O")
    .replace(/1/g, "I")
    .replace(/5/g, "S")
    .replace(/8/g, "B")
    .replace(/\|/g, "I")
    .replace(/[\[\]{}]/g, "")
    .replace(/[^a-zA-Z ,.'-]/g, "");

  name = name
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  name = name.trim();

  return name;
}

function cleanupDate(date) {
  if (!date) return null;
  const parts = date.split("/");
  if (parts.length === 3) {
    let month = parts[0].padStart(2, "0");
    let day = parts[1].padStart(2, "0");
    let year = parts[2];
    if (year.length === 2) year = "20" + year;
    return `${month}/${day}/${year}`;
  }
  return date;
}
