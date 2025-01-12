import clsx, { ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: any) {
  // Tạo đối tượng Date từ timestamp
  const date = new Date(timestamp);

  // Lấy các giá trị ngày, tháng, năm, giờ, phút
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần +1
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Kết hợp các giá trị vào định dạng mong muốn
  return `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${year} ${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

export const shortAddress = (address?: string) => {
  if (!address) return "";
  try {
    if (address.length > 10) {
      const start = address.slice(0, 8);
      const end = address.slice(-6);
      const shortenedAddress = `${start}...${end}`;
      return shortenedAddress;
    } else {
      return address;
    }
  } catch (e) {
    console.log(e);
    return "";
  }
};

export function toHumanRead(num: number, fixed: number = 2) {
  const units = ["", "K", "M", "B", "T", "Q"];
  let count = 0;
  num = +num;
  if (Number.isNaN(num)) {
    return "0";
  }
  while (num >= 1000) {
    num /= 1000;
    count++;
  }
  for (let i = 0; i < fixed; i++) {
    if (num === +num.toFixed(i)) return num.toFixed(i) + units[count];
  }
  return num.toFixed(2) + units[count];
}

export const exportToExcel = (data: any, network?: string) => {
  // Tạo worksheet từ dữ liệu với tiêu đề cột
  console.log("data :>> ", data);
  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

  // Tạo workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Xuất file Excel
  XLSX.writeFile(
    wb,
    `${network?.toUpperCase()}-${dayjs().format("DD/MM/YYYY")}.xlsx`
  );
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
