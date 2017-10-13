import imController from '../controller/imController.js'
module.exports = function(app) {
  app.get('/im/getToken', imController.getToken);

  app.get('/im/createrUser', imController.createrUser);

  app.get('/im/fetchMemberList', imController.fetchMemberList);

  app.post('/im/login', imController.login);
}
