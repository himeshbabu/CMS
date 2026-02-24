function createUser(data){
  validateRole(data.userId, ["Admin"]);
  const sheet=getSheet("Users");
  sheet.appendRow([
    data.newUserId,
    data.name,
    hashPassword(data.password),
    data.role,
    data.departmentId||"",
    data.storeName||"",
    false,
    new Date(),
    new Date()
  ]);
  return {success:true};
}

function getUser(userId){
  const sheet=getSheet("Users");
  const rows=sheet.getDataRange().getValues();
  for(let i=1;i<rows.length;i++){
    if(rows[i][0]===userId && rows[i][6]!==true){
      return {id:rows[i][0], role:rows[i][3]};
    }
  }
}

function getAllUsers(){
  const sheet = getSheet("Users");
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).filter(r => r[6] !== true);
}


function changePassword(userId, data){

  const sheet = getSheet("Users");
  const rows = sheet.getDataRange().getValues();

  for(let i=1;i<rows.length;i++){

    if(rows[i][0]===userId){

      if(rows[i][2]!==hashPassword(data.oldPassword))
        return {success:false,message:"Wrong current password"};

      sheet.getRange(i+1,3).setValue(hashPassword(data.newPassword));
      return {success:true};
    }
  }
}