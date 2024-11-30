const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/user.model');

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '207449856163-836u0pd8aopfkknmq22ab1018mukuseu.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:4002/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email: email });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            fullname: profile.displayName,
            avatar: {
              url: profile.photos[0].value,
              contentType: 'image/jpeg',
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});

module.exports = passport;
