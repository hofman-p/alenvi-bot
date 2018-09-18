const builder = require('botbuilder');

// =========================================================
// Root 'Infos' dialog
// =========================================================

const whichInfo = (session) => {
  session.sendTyping();
  builder.Prompts.choice(session, 'Quelle information souhaites-tu obtenir précisément ?', 'Contacts utiles|Actualités Alenvi', { maxRetries: 0 });
};

const redirectToInfoSelected = (session, results) => {
  if (results.response) {
    if (session.userData.alenvi) {
      switch (results.response.entity) {
        case 'Contacts utiles':
          session.replaceDialog('/usefull_contacts');
          break;
        case 'Actualités Alenvi':
          session.replaceDialog('/show_news_alenvi');
          break;
        default:
          break;
      }
    } else {
      session.endDialog('Vous devez vous connecter pour accéder à cette fonctionnalité ! :)');
    }
  } else {
    session.cancelDialog(0, '/not_understand');
  }
};

exports.select = [whichInfo, redirectToInfoSelected];
