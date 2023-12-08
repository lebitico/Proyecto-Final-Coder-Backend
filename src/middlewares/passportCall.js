import passport from "passport";

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: "not authorized",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export default passportCall;
