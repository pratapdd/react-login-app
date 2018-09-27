const User = require('../../models/User')
const UserSession = require('../../models/UserSession')


module.exports = (app) => {
  // SignUp
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
      firstName,
      lastName,
      password
    } = body;
    let {
      email
    } = body;

    if (!firstName) {
      res.end({
        success: false,
        message: 'Error : Frist name cannot be blank.'
      })
    }
    if (!lastName) {
      res.end({
        success: false,
        message: 'Error : Last name cannot be blank.'
      })
    }
    if (!email) {
      res.end({
        success: false,
        message: 'Error : email cannot be blank.'
      })
    }
    if (!password) {
      res.end({
        success: false,
        message: 'Error : Password name cannot be blank.'
      })
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        res.end('Error : Server error');
      } else if (previousUsers.length > 0) {
        res.end('Error : Account already exist.')
      }

      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          res.end({
            success: false, message: 'Error : Server error'
          });
        }
        res.end({
          success: true,
          message: 'Signed Up'
        });
      })
    })
  })

  app.post('/api/account/signin', (req, res, next) => {
    
    const { body } = req;

    const {
      password
    } = body;
    let { email } = body;

    email = email.toLowerCase();

    User.find({
      email:email
    }, (err, users) => {
      console.log(users)
      if (err) {
        return res.send({
          success: false,
          message: 'Error : server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error : Invalid users'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error : Invalid password'
        })
      }

      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error : server error'
          });
        }

        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        })
      });
    })
  })

  //some cast error here in this api
  app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    })
  });

  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }

        return res.send({
          success: true,
          message: 'Good'
        });
      })
    })


}