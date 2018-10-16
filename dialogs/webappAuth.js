// const builder = require('botbuilder');
const jwt = require('jsonwebtoken');
const { getAlenviUserById } = require('../models/Alenvi/users');
const { storeUserAddress } = require('../helpers/storeUserAddress');

exports.autoLogin = async (session) => {
  let token = '';
  if (session.message.sourceEvent.postback && session.message.sourceEvent.postback.referral && session.message.sourceEvent.postback.referral.ref) {
    token = session.message.sourceEvent.postback.referral.ref;
  } else if (session.message.sourceEvent.referral && session.message.sourceEvent.referral.ref) {
    token = session.message.sourceEvent.referral.ref;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error('ERROR VERIFY TOKEN');
      console.error(err);
      if (err.name === 'JsonWebTokenError') {
        session.endDialog('Il y a eu un problème avec ta demande :/');
      }
      if (err.name === 'TokenExpiredError') {
        session.endDialog('Ta demande a expiré !');
      }
    } else {
      try {
        console.log('DECODED !');
        console.log(decoded);
        const userId = decoded._id;
        const userDataAlenviRaw = await getAlenviUserById(userId);
        const userDataAlenvi = userDataAlenviRaw.body.data.user;
        session.userData.alenvi = userDataAlenvi;
        await storeUserAddress(session);
        session.send(`Bienvenue, ${session.userData.alenvi.firstname}! Merci de t'être connecté(e) ! :)`);
        session.replaceDialog('/hello');
      } catch (e) {
        console.error(e);
        return session.endDialog('Il y a eu un problème avec ta demande :/');
      }
    }
  });
};

exports.logout = (session) => {
  delete session.userData.alenvi;
  delete session.userData.ogust;
  return session.endDialog('Compte bien déconnecté ! Reviens-vite :)');
};
