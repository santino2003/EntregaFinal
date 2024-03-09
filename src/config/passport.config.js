const passport = require("passport");
const local = require("passport-local");
const userModel = require("../dao/models/user.model");
const {createHash, isValidPasswd } = require("../utils/encrypt");
const GithubStrategy = require("passport-github2")
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

          req.session.user = { email, firstName: first_name, lastName: last_name }
          console.log( "entre passport",req.session.user)
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
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          
          if (!user) {
            return done(null, false);
          }

          console.log(user)
          if (!isValidPasswd(password, user.password)) {
            return done(null, false);
          }
          req.session.user = {
  
            ...user,
          };
      

          return done(null, user);
        } catch (error) {
          console.log(error);

          // return done(error);
        }
      }
    )
  );
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "7e0b7c5237a77e4ee90e",
        clientSecret: "fbcebc06c9e90f223c415040de11c5a4c6e8315b",
        callbackURL: "http://localhost:8080/api/session/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(
          "🚀 ~ file: passport.config.js:17 ~ async ~ profile:",
          profile
        );
        try {
          let user = await userModel.findOne({ email: profile._json?.email });
          if (!user) {
            let addNewUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json?.email,
              age: 0,
              password: "",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            // ya existia el usuario
            done(null, user);
          }
        } catch (error) {
          console.log("🚀 ~ file: passport.config.js:39 ~ error:", error);

          done(error);
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
