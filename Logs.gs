function logActivity(ticketID, action, user, oldStatus, newStatus) {
  const sheet = getSheet("Logs");
  sheet.appendRow([
    Utilities.getUuid(),
    ticketID,
    action,
    user,
    oldStatus,
    newStatus,
    new Date()
  ]);
}