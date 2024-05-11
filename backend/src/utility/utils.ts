import fs from "fs";

export const mkdir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const urlencode = (str: string) => {
  return encodeURIComponent(str);
};
