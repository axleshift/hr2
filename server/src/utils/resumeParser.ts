import natural from "natural";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Function to parse PDF files
const parsePDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Function to parse DOCX files
const parseDocx = async (filePath: string): Promise<string> => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const tokenizer = new natural.WordTokenizer();
const regex = {
  name: /[A-Z][a-z]*\s[A-Z][a-z]*/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone:
    /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/g,
  address:
    /\d{1,4}[\w\s,]+(Street|Avenue|Boulevard|Road|St|Ave|Blvd|Rd),\s[\w\s,]+/i,
  linkedin: /linkedin\.com\/\S*/,
};

const extractContactInfo = (text: string) => {
  const names = text.match(regex.name);
  const emails = text.match(regex.email);
  const phones = text.match(regex.phone);
  const linkedin = text.match(regex.linkedin);
  const addresses = text.match(regex.address);
  return {
    names: names ? names : [],
    emails: emails ? emails : [],
    phones: phones ? phones : [],
    linkedin: linkedin ? linkedin : [],
    addresses: addresses ? addresses : [],
  };

  // const extractRelevantInfo = (text: string) => {
  //     const tokens = tokenizer.tokenize(text);
  //     const foundSkills = tokens.filter((token) => skills.includes(token));
  // };
};

export { parsePDF, parseDocx, extractContactInfo };
