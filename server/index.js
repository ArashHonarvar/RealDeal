'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { validationResult, body } = require('express-validator'); // validation middleware
//const cors = require('cors');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

const User = require('./Services/user');
const user = new User;

const Voucher = require('./Services/voucher');
const voucher = new Voucher;

const Interest = require('./Services/interest');
const interest = new Interest;

const Friend = require('./Services/friend');
const friend = new Friend;

const Invitation = require('./Services/invitation');
const invitation = new Invitation;

const UserInterest = require('./Services/userInterest');
const userInterest = new UserInterest;

const app = express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json({ limit: "50mb" }));
/*const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));*/

app.use(session({
  secret: 'RealDeal',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (username, password, done) {
    user.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Username and/or password wrong. Try again.' });
      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
};

app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    else {
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
    }
  })(req, res, next);
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });
});

const validationNewUser = [
  body('type', 'type is not on the list of possible roles').isIn(['User', 'Business']),
  body('password', 'password is required').notEmpty(),
  body('email', 'email format is wrong').isEmail(),
];

const validationUserInfo = [
  body('userInfo.name', 'name is required').notEmpty(),
  body('userInfo.age', 'age must be a number').isNumeric(),
  body('userInfo.city', 'city is required').notEmpty(),
];

const validationBusinessInfo = [
  body('businessInfo.name', 'name is required').notEmpty(),
  body('businessInfo.piva', 'p.iva is required').notEmpty(),
  body('businessInfo.address', 'address is required').notEmpty(),
  body('businessInfo.city', 'city is required').notEmpty(),
  body('businessInfo.phone_number', 'phone number is required').notEmpty(),
];

const validationVoucher = [
  body('title', 'title is required').notEmpty(),
  body('creation_date', 'creation date is required').notEmpty(),
  body('expiration_date', 'expiration date is required').notEmpty(),
  body('image', 'image is required').notEmpty(),
  body('interest_id', 'interest id must be a number').isNumeric(),
  body('quantity', 'quantity must be a number').isNumeric(),
];

const validationInvitation = [
  body('receiver_id', 'receiver id must be a number').isNumeric(),
  body('voucher_id', 'voucher id must be a number').isNumeric(),
];

const validationAddInterest = [
  body('userInterests', 'userInterests is required').notEmpty(),
];

const checkRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  next()
};

app.post('/api/register', validationNewUser, checkRules, async (req, res) => {
  try {
    await user.registerUser(req.body);
    res.status(201).end();
  } catch (err) {
    console.log(err);
    if (err.includes("SQLITE_CONSTRAINT")) {
      res.status(400).json({ error: `The user is already registered` });
    } else {
      res.status(500).json({ error: `Database error during the registration` });
    }
  }
});

app.get('/api/user-type/:user_id', isLoggedIn, async (req, res) => {
  return user.getUserType(req, res);
});

app.post('/api/user-info', validationUserInfo, checkRules, async (req, res) => {
  try {
    await user.addUserInfo(req.body.userInfo, req.body.userId);
    res.status(201).end();
  } catch (err) {
    console.log(err);
    if (err.includes("SQLITE_CONSTRAINT")) {
      res.status(400).json({ error: `The user is already registered` });
    } else {
      res.status(500).json({ error: `Database error during the registration` });
    }
  }
});

app.post('/api/business-info', validationBusinessInfo, checkRules, async (req, res) => {
  try {
    await user.addBusinessInfo(req.body.businessInfo, req.body.userId);
    res.status(201).end();
  } catch (err) {
    console.log(err);
    if (err.includes("SQLITE_CONSTRAINT")) {
      res.status(400).json({ error: `The user is already registered` });
    } else {
      res.status(500).json({ error: `Database error during the registration` });
    }
  }
});

app.post('/api/new-voucher', validationVoucher, checkRules, async (req, res) => {
  return voucher.addNewVoucher(req, res);
});

app.get('/api/business-vouchers', isLoggedIn, async (req, res) => {
  return voucher.getVouchersByBusinessId(req, res);
});

app.put('/api/edit-voucher', validationVoucher, isLoggedIn, async (req, res) => {
  return voucher.editVoucher(req, res);
});

app.delete('/api/delete-voucher/:voucher_id', isLoggedIn, async (req, res) => {
  return voucher.deleteVoucher(req, res);
});

app.get('/api/vouchers', isLoggedIn, async (req, res) => {
  return voucher.getVouchers(req, res);
});

app.get('/api/voucher/:id', isLoggedIn, async (req, res) => {
  return voucher.getVoucherById(req, res);
});

app.get('/api/all-interests', isLoggedIn, async (req, res) => {
  return interest.getAllInterests(req, res);
});

app.get('/api/user-interests/:userId', isLoggedIn, async (req, res) => {
  return interest.getInterestsByUserId(req, res);
});

app.get('/api/my-friends', isLoggedIn, async (req, res) => {
  return friend.getFriendsByUserId(req, res);
});

app.get('/api/interested-friends/:interestId', isLoggedIn, async (req, res) => {
  return friend.getFriendsByInterest(req, res);
});


app.get('/api/user-profile/:userId', isLoggedIn, async (req, res) => {
  return user.getUserInfo(req, res);
});

app.get('/api/business-profile/:userId', isLoggedIn, async (req, res) => {
  return user.getBusinessInfo(req, res);
});

app.post('/api/send-invitation', validationInvitation, checkRules, async (req, res) => {
  return invitation.sendInvitation(req, res);
});

app.get('/api/received-invitations', isLoggedIn, async (req, res) => {
  return invitation.getReceivedInvitations(req, res);
});

app.get('/api/sent-invitations', isLoggedIn, async (req, res) => {
  return invitation.getSentInvitations(req, res);
});

app.get('/api/sent-invitation/:receiver_id/:voucher_id', isLoggedIn, async (req, res) => {
  return invitation.getSentInvitation(req, res);
});

app.get('/api/received-invitation/:sender_id/:voucher_id', isLoggedIn, async (req, res) => {
  return invitation.getReceivedInvitation(req, res);
});

app.put('/api/accept-invitation', isLoggedIn, async (req, res) => {
  return invitation.acceptInvitation(req, res);
});

app.put('/api/decline-invitation', isLoggedIn, async (req, res) => {
  return invitation.declineInvitation(req, res);
});

app.put('/api/done-invitation', isLoggedIn, async (req, res) => {
  return invitation.doneInvitation(req, res);
});

app.get('/api/user-accepted-invitations-sent', isLoggedIn, async (req, res) => {
  return invitation.getUserAcceptedInvitationsSent(req, res);
});

app.get('/api/user-accepted-invitations-received', isLoggedIn, async (req, res) => {
  return invitation.getUserAcceptedInvitationsReceived(req, res);
});

app.get('/api/user-last-invitations-sent', isLoggedIn, async (req, res) => {
  return invitation.getUserLastInvitationsSent(req, res);
});

app.get('/api/user-last-invitations-received', isLoggedIn, async (req, res) => {
  return invitation.getUserLastInvitationsReceived(req, res);
});

app.delete('/api/delete-invitation', isLoggedIn, async (req, res) => {
  return invitation.deleteInvitation(req, res);
});

app.get('/api/common-vouchers/:friend_id', isLoggedIn, async (req, res) => {
  return voucher.getCommonVouchers(req, res);
});

app.get('/api/all-interests', isLoggedIn, async (req, res) => {
  return interest.getAllInterests(req, res);
});

app.get('/api/possible-friends', isLoggedIn, async (req, res) => {
  return friend.getPossibleFriends(req, res);
});

app.post('/api/thumbs-up/:friend_id', isLoggedIn, async (req, res) => {
  return friend.thumbsUp(req, res);
});

app.post('/api/thumbs-down/:friend_id', isLoggedIn, async (req, res) => {
  return friend.thumbsDown(req, res);
});

app.get('/api/my-interests', isLoggedIn, async (req, res) => {
  return userInterest.getAllUserInterests(req, res);
});

app.get('/api/creator-image/:id', async (req, res) => {
  return user.getCreatorImage(req, res);
});


app.post('/api/my-interests', validationAddInterest, isLoggedIn, async (req, res) => {
  let userInterests = req.body.userInterests;
  try {
    await userInterest.removeAllUserInterests(req.user.id);
  } catch (err) {
    let message = "Server error"
    console.log(err)
    return res.status(503).json(message);
  }
  console.log(req.body);
  for (let interest of userInterests) {
    try {
      await userInterest.addUserInterest(interest);
      res.status(201).end();
    } catch (err) {
      let message = "Server error"
      console.log(err)
      return res.status(503).json(message);
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;