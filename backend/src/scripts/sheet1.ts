import * as path from 'path';
import xlsx from 'xlsx';

const excelPath = path.resolve(process.cwd(), '../India_Medical_Colleges_2026_27_COMPLETE.xlsx');
const workbook = xlsx.readFile(excelPath);

console.log('ALL SHEETS:', workbook.SheetNames);
const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
const data1 = xlsx.utils.sheet_to_json(sheet1);
console.log(`Sheet "${workbook.SheetNames[0]}" count:`, data1.length);
console.log('Columns:', Object.keys(data1[0] as object));
console.log('Sample row 1:', data1[0]);
