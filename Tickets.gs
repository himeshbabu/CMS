function generateTicketID() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  const sheet = getSheet("Tickets");
  const lastRow = sheet.getLastRow();
  const year = new Date().getFullYear();
  const seq = lastRow > 1 ? lastRow - 1 : 1;
  const id = `MALL-${year}-${("0000"+seq).slice(-4)}`;
  lock.releaseLock();
  return id;
}

function createTicket(data) {
  validateRole(data.userId, ["Tenant"]);
  const sheet = getSheet("Tickets");
  const ticketID = generateTicketID();
  sheet.appendRow([
    ticketID, data.userId, data.ticketType, data.priority,
    "Submitted", "", data.description,
    JSON.stringify(data.attachments || []),
    new Date(), new Date(), false
  ]);
  logActivity(ticketID,"Created",data.userId,"","Submitted");
  return { success:true, ticketID };
}

function getTickets(data){

  const limit = data.limit || 20;
  const offset = data.offset || 0;

  const sheet = getSheet("Tickets");
  const rows = sheet.getDataRange().getValues();
  const user = getUser(data.userId);

  let filtered = [];

  for(let i=1;i<rows.length;i++){

    if(rows[i][10] === true) continue;

    if(user.role === "Tenant" && rows[i][1] !== data.userId)
      continue;

    filtered.push(rows[i]);
  }

  return filtered.slice(offset, offset + limit);
}

function updateTicketStatus(data){
  const sheet=getSheet("Tickets");
  const rows=sheet.getDataRange().getValues();
  for (let i=1;i<rows.length;i++){
    if(rows[i][0]===data.ticketID){
      const oldStatus=rows[i][4];
      sheet.getRange(i+1,5).setValue(data.newStatus);
      logActivity(data.ticketID,"Status Update",data.userId,oldStatus,data.newStatus);
      return {success:true};
    }
  }
  return {success:false};
}


function getTicketForm(ticketType) {
  const sheet = getSheet("TicketTypes");
  const rows = sheet.getDataRange().getValues();
  let fields = [];

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === ticketType) {
      fields.push({
        fieldName: rows[i][1],
        label: rows[i][2],
        type: rows[i][3],
        required: rows[i][4]
      });
    }
  }
  return fields;
}