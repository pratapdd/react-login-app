const fs = require('fs');
const path = require('path');

module.exports = (app) => {

  const User = require('../models/User')
  const UserSession = require('../models/UserSession')

  // API routes
  fs.readdirSync(__dirname + '/api/').forEach((file) => {
    console.log('--importing--', `./api/${file.substr(0, file.indexOf('.'))}`)
    require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
  });
};
