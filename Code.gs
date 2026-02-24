function doPost(e){
  try{

    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if(action === "login")
      return json(login(body));

    if(action === "logout")
      return json(logoutSession(body.token));

    // All other routes require token
    const session = validateToken(body.token);

    switch(action){

      case "createTicket":
        return json(createTicket({...body, userId:session.userId}));

      case "getTickets":
        return json(getTickets({...body, userId:session.userId}));

      case "updateTicketStatus":
        return json(updateTicketStatus({...body, userId:session.userId}));

      case "createUser":
        validateRole(session.userId, ["Admin"]);
        return json(createUser({...body, userId:session.userId}));

      case "getUsers":
        return json(getAllUsers());

      case "getDepartments":
        return json(getDepartments());

      case "getTicketForm":
        return json(getTicketForm(body.ticketType));

      case "changePassword":
        return json(changePassword(session.userId, body));

      default:
        return json({success:false,message:"Invalid action"});
    }

  }catch(err){
    return json({success:false,error:err.toString()});
  }
}




function doGet() {
  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Mall Ticket System");
}

function include(file){
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}