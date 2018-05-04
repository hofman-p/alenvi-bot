const builder = require('botbuilder');
const _ = require('lodash');

const { getCustomers } = require('../models/Ogust/employees');

const checkOgustToken = require('../helpers/checkOgustToken').checkToken;

const getFirstEmployeeCustomer = async (session) => {
  try {
    const myCustomersRaw = await getCustomers(session.userData.ogust.tokenConfig.token, session.userData.alenvi.employee_id);
    const myCustomers = myCustomersRaw.body.data.customers.filter(customer => !customer.last_name.match(/^alenvi/i));
    const firstEmployeeCustomer = _.sortBy(myCustomers, ['last_name']).slice(0, 1);
    return firstEmployeeCustomer;
  } catch (e) {
    console.error(e);
    return session.endDialog("Mince, je n'ai pas réussi à récupérer tes bénéficiaires");
  }
};

const getCardsAttachments = async (session, args) => {
  if (!args) {
    throw new Error('No personType and/or personChosen');
  }
  const title = 'Consulter planning';
  const { sector } = session.userData.alenvi;
  let employeeId = '';
  let customerId = '';
  let url = '';
  let customer;
  switch (args.personType) {
    case 'Auxiliary':
      employeeId = session.userData.alenvi.employee_id;
      url = `${process.env.WEBSITE_HOSTNAME}/bot/calendar?id_employee=${employeeId}&access_token=${session.userData.alenvi.token}`;
      break;
    case 'Customer':
      customer = await getFirstEmployeeCustomer(session);
      // customerId = args.personChosen.customer_id;
      customerId = customer[0].id_customer;
      url = `${process.env.WEBSITE_HOSTNAME}/bot/calendar?id_customer=${customerId}&sector=${sector}&access_token=${session.userData.alenvi.token}`;
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
