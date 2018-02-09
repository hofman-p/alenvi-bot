const builder = require('botbuilder');

const checkOgustToken = require('../helpers/checkOgustToken').checkToken;

const getCardsAttachments = async (session, args) => {
  if (!args) {
    throw new Error('No personType and/or personChosen');
  }
  let employeeId = '';
  let customerId = '';
  let url = '';
  let title;
  switch (args.personType) {
    case 'Auxiliary':
      employeeId = session.userData.alenvi.employee_id;
      title = 'Consulter planning';
      url = `${process.env.WEBSITE_HOSTNAME}/calendar?id_employee=${employeeId}&access_token=${session.userData.alenvi.token}&self=true`;
      break;
    // case 'Auxiliary':
    //   employeeId = args.personChosen.employee_id;
    //   title = 'Consulter son planning';
    //   url = `${process.env.WEBSITE_HOSTNAME}/calendar?id_employee=${employeeId}&access_token=${session.userData.alenvi.token}&self=false`;
    //   break;
    case 'Customer':
      customerId = args.personChosen.customer_id;
      title = 'Consulter son planning';
      url = `${process.env.WEBSITE_HOSTNAME}/calendar?id_customer=${customerId}&access_token=${session.userData.alenvi.token}`;
  }
  const myCards = [];
  myCards.push(
    new builder.HeroCard(session)
      .title(title)
      .buttons([
        builder.CardAction.openUrl(session, url, '📅  Consulter')
      ])
  );
  return myCards;
};

const displayCalendar = async (session, args) => {
  try {
    session.sendTyping();
    await checkOgustToken(session);
    const cards = await getCardsAttachments(session, args);
    const message = new builder.Message(session)
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments(cards);
    session.endDialog(message);
  } catch (err) {
    console.error(err);
    return session.endDialog("Je n'ai pas réussi à récupérer ton planning :/");
  }
};

exports.displayCalendar = [displayCalendar];
