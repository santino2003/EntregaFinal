const passport = require("passport");
const local = require("passport-local");
const userModel = require("../dao/models/user.model");
const {createHash, isValidPasswd } = require("../utils/encrypt");

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {


        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userModel.findOne({ email });
          console.log(user);
          if (user) {
            // el usuario existe
            return done(null, false);
          }
          const pswHashed = await createHash(password);

          const addUser = {
            first_name,
            last_name,
            email,
            age,
            password: pswHashed,
          };

          const newUser = await userModel.create(addUser);

          if (!newUser) {
            return res
              .status(500)
              .json({ message: `we have some issues register this user` });
          }

          return done(null, newUser);
        } catch (error) {
          return done(`error getting user ${error}`);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          console.log("ingrese")
          if (!user) {
            return done(null, false);
          }

          console.log(user)
          if (!isValidPasswd(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          console.log(error);

          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

module.exports = initializePassport;
