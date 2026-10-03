import * as path from 'path';
import xlsx from 'xlsx';

const excelPath = path.resolve(process.cwd(), '../India_Medical_Colleges_2026_27_COMPLETE.xlsx');
console.log('Reading Excel file from:', excelPath);

const workbook = xlsx.readFile(excelPath);
console.log('Sheet Names:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: null });
  console.log(`\n================ Sheet: "${sheetName}" ================`);
  console.log('Total Rows:', data.length);
  if (data.length > 0) {
    console.log('Column Names:', Object.keys(data[0]));
    console.log('\nSample Record 1:\n', JSON.stringify(data[0], null, 2));
    if (data.length > 1) {
      console.log('\nSample Record 2:\n', JSON.stringify(data[1], null, 2));
    }
    if (data.length > 2) {
      console.log('\nSample Record 3:\n', JSON.stringify(data[2], null, 2));
    }

    // Check unique states
    const states = new Set(data.map(d => d['State'] || d['STATE'] || d['state']));
    console.log('\nUnique States Count:', states.size);
    console.log('States List:', Array.from(states));

    for (const key of Object.keys(data[0])) {
      const distinctVals = new Set(data.map(d => d[key]));
      if (distinctVals.size < 20) {
        console.log(`Distinct values for '${key}':`, Array.from(distinctVals));
      }
    }
  }
}
