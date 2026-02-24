function getDepartments(){
  const sheet = getSheet("Departments");
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).filter(r => r[2] !== true);
}