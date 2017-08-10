import passport from 'passport';
import { Strategy } from 'passport-github2';
import config from '../config';

const requiredLogin = config.github.enabled;

export default {

  use: (app) => {

    if (!requiredLogin) {
      return;
    }

    // passport setup Strategy
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    passport.use(new Strategy({
      clientID: config.github.appId,
      clientSecret: config.github.secret,
      callbackURL: `${config.global.base}/auth/github/callback`
    }, (accessToken, refreshToken, profile, cb) =>
      cb(null, { ...profile, token: accessToken })
    ));

    app.use(passport.initialize());
    app.use(passport.session());

    // Endpoint to confirm authentication is still in valid
    app.get('/auth',
      (req, res, next) => {
        if (req.isAuthenticated() || !requiredLogin) {
          return next();
        }
        return res.status(401).json({});
      }, (req, res) => {
        res.status(200).json(
          requiredLogin ? {
            id: req.user.id,
            token: req.user.token
          } : {
            id: 'anonymous',
            token: ''
          });
      });

    app.get('/auth/github',
      passport.authenticate('github', { session: true }));

    app.get('/auth/github/callback',
      passport.authenticate('github', { session: true, failureRedirect: '/auth/github' }),
      (req, res) => {
        const redirect = req.cookies.redirect || '/';
        res.clearCookie('redirect');
        res.redirect(redirect);
      });
  }
};
