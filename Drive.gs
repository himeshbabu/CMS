function uploadFile(data){
  const allowed=["image/jpeg","image/png","application/pdf"];
  if(!allowed.includes(data.mimeType)) throw "Invalid file type";
  const blob=Utilities.newBlob(
    Utilities.base64Decode(data.base64),
    data.mimeType,
    data.fileName
  );
  const folder=DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const file=folder.createFile(blob);
  return {success:true,url:file.getUrl()};
}