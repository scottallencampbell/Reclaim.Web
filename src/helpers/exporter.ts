import moment from "moment";
import * as Excel from "exceljs";
import { Account, Customer, Investigator, Job } from "api/schema";

const exportFile = async (name: string, data: any) => {     
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet(name);

  const headers: any[] = [];
  const keys = Object.keys(data[0]);
  
  keys.forEach((key: string) => {
    headers.push({ header: key, key: key });
  });

  ws.columns = headers;
    
  data.forEach((item: any, i: number) => {
    ws.addRow(item);
  });

  formatSheet(ws, keys);
  autoFitColumnWidth(ws);

  const buffer = await wb.xlsx.writeBuffer();

  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name} ${moment().format("MM-DD-YYYY hh-mm-ssA").toLowerCase()}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);    
}

const formatSheet = (ws: Excel.Worksheet, keys: string[]) => {
  const headerRow = ws.getRow(1);
  
  for (let i = 1; i <= keys.length; i++) {
    const cell = headerRow.getCell(i);
    cell.font = { bold: true };
    cell.border = { bottom: { style: "thin" } };
  }

  ws.columns.forEach((column) => {
    column.alignment = {"horizontal": "left"};
  });

  const lastColumnLetter = columnToLetter(keys.length);
  ws.autoFilter = `A1:${lastColumnLetter}1`; 
}

const autoFitColumnWidth = (ws: Excel.Worksheet, minimalWidth = 0) => {
  ws.columns.forEach((column) => {
    let maxColumnLength = 0;
    if (column && typeof column.eachCell === 'function') {
      column.eachCell({includeEmpty: true}, (cell) => {
        maxColumnLength = Math.max(
          maxColumnLength,
          minimalWidth,
          cell.value ? cell.value.toString().length : 0
        );
      });
      column.width = maxColumnLength * 1.2;
    }
  });  
};

const columnToLetter = (column: number) => {
  let temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

export async function exportCustomers (customers: Customer[]) {
    const data = customers?.map((o, i) => { return { 
      "Name": o.name,
      "Code": o.code,
      "Email address": o.emailAddress,
      "Address": o.address,
      "Apartment/suite": o.address2,
      "City": o.city,
      "State": o.state,
      "Postal code": o.postalCode,
      "Telephone": o.telephone
    }});

     await exportFile("Customers", data);
}

export async function exportInvestigators (investigators: Investigator[]) {
  const data = investigators?.map((o, i) => { return { 
    "Last name": o.lastName,
    "First name": o.firstName,
    "Email address": o.emailAddress,
    "Telephone": o.telephone
   }});

   await exportFile("Customers", data);
}

export async function exportSignins (accounts: Account[]) {    
    const data = accounts?.map((o, i) => { return { 
      "Email address": o.emailAddress,
      "Role": o.role,
      "Signed in": o.sessionAuthenticatedTimestamp == null ? null : moment(o.sessionAuthenticatedTimestamp).format("MM/DD/YYYY hh:mmA"),
      "Last active": o.lastActiveTimestamp == null ? null : moment(o.lastActiveTimestamp).format("MM/DD/YYYY hh:mmA")
     }});

    await exportFile("Signins", data);
}


export async function exportJobs (jobs: Job[]) {    
  const data = jobs?.map((o, i) => { return { 
    "Name": o.name,
    "Description": o.description,
    "Status": o.status,
    "Type": o.type,
    "Interval": o.interval,
    "Next event": o.nextEvent == null ? null : moment(o.nextEvent).format("MM/DD/YYYY hh:mmA")
   }});

  await exportFile("Jobs", data);
}