//=========================================================
// Hello when connected or not
//=========================================================

const builder = require('botbuilder');

exports.hello_first = [
  (session, args) => {
    console.log("/HELLO_FIRST");
    session.sendTyping();
    session.send("Hello ! Je m'appelle Pigi, le petit oiseau qui facilite ton quotidien chez Alenvi 😉");
    session.send("Il semblerait que nous ne nous connaissions pas encore ! Peux-tu t'authentifier chez Alenvi grâce à Facebook, pour que je puisse te reconnaître ?");
    session.beginDialog('/login_facebook');
  }
];

exports.hello = [
  (session, args) => {
    console.log("/HELLO");
    // console.log("USERDATA =");
    // console.log(session.userData);
    if (!session.userData.alenvi) {
      session.beginDialog('/hello_first');
    } else {
      session.sendTyping();
      // console.log("SESSION =");
      // console.log(session);
      builder.Prompts.choice(session, "Hello " + session.userData.alenvi.firstname + "! 😉 Comment puis-je t’aider ?", "Consulter planning|Modifier planning|Bénéficiaires|Equipe|Infos");
    }
  },
  (session, results) => {
    if (results.response) {
      if (session.userData.alenvi) {
        console.log(results.response);
        switch (results.response.entity) {
          case "Consulter planning":
            session.beginDialog("/select_planning");
            break;
          case "Modifier planning":
            console.log("Modify planning");
            break;
          case "Bénéficiaires":
            console.log("Beneficiaires");
            break;
          case "Equipe":
            console.log("Equipe");
            break;
          case "Infos":
            console.log("Infos");
            break;
        }
        // session.endDialog();
      }
      else {
        session.endDialog("Vous devez vous connecter pour accéder à cette fonctionnalité ! :)");
      }
    }
  }
];
