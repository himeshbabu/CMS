const CONFIG = {
  SPREADSHEET_ID: "1hcf-1S-OOtNx_dGH15a3i3T4QccZGRRYufgTHp4NVPU",
  DRIVE_FOLDER_ID: "1ElAEKQpgr6rdJ2yHNdp4O71CFX_ZsvcC",
};

function getSheet(name) {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(name);
}