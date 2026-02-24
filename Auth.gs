const SESSION_EXPIRY_MINUTES = 60;

function hashPassword(password) {
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return raw.map(b => (b+256).toString(16).slice(-2)).join('');
}

function login(data){

  checkLoginAttempts(data.userId);

  const sheet = getSheet("Users");
  const rows = sheet.getDataRange().getValues();
  const hash = hashPassword(data.password);

  for (let i=1;i<rows.length;i++){

    if(rows[i][0]===data.userId && rows[i][6]!==true){

      if(rows[i][2]!==hash){
        recordFailedAttempt(data.userId);
        return {success:false,message:"Invalid credentials"};
      }

      clearFailedAttempts(data.userId);

      const token = Utilities.getUuid();
      const expiry = new Date(new Date().getTime() + SESSION_EXPIRY_MINUTES*60000);

      getSheet("Sessions").appendRow([
        token,
        rows[i][0],
        rows[i][3],
        expiry,
        true
      ]);

      return {
        success:true,
        token:token,
        user:{
          id:rows[i][0],
          name:rows[i][1],
          role:rows[i][3]
        }
      };
    }
  }

  return {success:false,message:"User not found"};
}

function validateToken(token){

  const sheet = getSheet("Sessions");
  const rows = sheet.getDataRange().getValues();

  for(let i=1;i<rows.length;i++){

    if(rows[i][0]===token && rows[i][4]===true){

      if(new Date(rows[i][3]) < new Date()){
        throw "Session expired";
      }

      return {
        userId: rows[i][1],
        role: rows[i][2]
      };
    }
  }

  throw "Invalid session";
}

function logoutSession(token){
  const sheet=getSheet("Sessions");
  const rows=sheet.getDataRange().getValues();

  for(let i=1;i<rows.length;i++){
    if(rows[i][0]===token){
      sheet.getRange(i+1,5).setValue(false);
      return {success:true};
    }
  }
}


function checkLoginAttempts(userId){

  const cache = CacheService.getScriptCache();
  const attempts = cache.get("login_"+userId);

  if(attempts && Number(attempts) >= 5){
    throw "Too many failed attempts. Try again later.";
  }
}

function recordFailedAttempt(userId){
  const cache = CacheService.getScriptCache();
  const attempts = cache.get("login_"+userId);
  const newCount = attempts ? Number(attempts)+1 : 1;
  cache.put("login_"+userId, newCount, 600);
}

function clearFailedAttempts(userId){
  CacheService.getScriptCache().remove("login_"+userId);
}

function generateHash(){
  Logger.log(hashPassword("Admin@123"));
  Logger.log(hashPassword("Mall@123"));
  Logger.log(hashPassword("Dept@123"));
  Logger.log(hashPassword("Tenant@123"));
}