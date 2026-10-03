import * as path from 'path';
import xlsx from 'xlsx';

const excelPath = path.resolve(process.cwd(), '../India_Medical_Colleges_2026_27_COMPLETE.xlsx');
const workbook = xlsx.readFile(excelPath);

const masterSheet = workbook.Sheets['College Master'];
const masterData: any[] = xlsx.utils.sheet_to_json(masterSheet);

console.log('Sample 10 colleges:');
for (let i = 0; i < 10; i++) {
  console.log(`--- College ${i + 1} ---`);
  console.log(masterData[i]);
}

const pgSheet = workbook.Sheets['PG Detail'];
const pgData: any[] = xlsx.utils.sheet_to_json(pgSheet);
console.log('\nSample 5 PG courses:');
for (let i = 0; i < 5; i++) {
  console.log(pgData[i]);
}

const stateSummarySheet = workbook.Sheets['State Summary'];
const stateData: any[] = xlsx.utils.sheet_to_json(stateSummarySheet);
console.log('\nSample 5 States:');
for (let i = 0; i < 5; i++) {
  console.log(stateData[i]);
}
