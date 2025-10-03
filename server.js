const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config(); // load .env into process.env
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const mongodb = require('./database/connect');

const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const authRoutes = require("./routes/accountRoutes");
const GitHubStrategy = require("passport-github2").Strategy;


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL || "http://localhost:8080/auth/github/callback",
      scope: ["read:user", "user:email"],
    },
    // TODO: upsert the user in your DB here and pass the db user to done()
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: "github",
      };
      return done(null, user);
    }
  )
);

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, _res, next) => {
  console.log('REQ', req.method, req.originalUrl);
  next();
});
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/auth", authRoutes)
  .use('/movies', movieRoutes)
  .use('/theaters', theaterRoutes)
  .use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      // include cookies on requests (same-origin gets them by default,
      // but this helps if you ever host UI at a different subpath)
      requestInterceptor: (req) => {
        // if you ever serve Swagger from a different origin, uncomment:
        // req.credentials = 'include';
        return req;
      },
      responseInterceptor: (res) => {
        try {
          if (res && res.status === 401 && typeof window !== "undefined") {
            // kick off OAuth login; after login, you'll bounce back via returnTo
            window.location = "/auth/github";
          }
        } catch (_) {}
        return res;
      },
    },
  })
);



  
const port = process.env.PORT || 3000;  // fallback for local dev
const host = process.env.HOST || "localhost"; 

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});