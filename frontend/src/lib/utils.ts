import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFilename = (path: string) => {
  return path.split("/").pop();
};

export const formatBytes = (bytes: number, decimals = 0) => {
  if (bytes == 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
};

export const copyToClipboard = async (data: string) => {
  try {
    await navigator.clipboard.writeText(data);
    toast.success("Copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy!");
  }
};
