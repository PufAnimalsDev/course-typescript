import fs from "fs";

export const loadData = <T>(filePath: string): T[] => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Błąd podczas ładowania danych z pliku:", err);
    return [];
  }
};

export const saveData = (filePath: string, data: any[]): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Błąd podczas zapisywania danych do pliku:", err);
  }
};