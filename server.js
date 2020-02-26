const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const proxy = require("http-proxy-middleware");

const app = express();

const result = dotenv.config();
const session = require('express-session');
const log4js = require('log4js');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const logger = log4js.getLogger('blog');

 app.use(session({
     secret: '123456',
     resave: true,
     saveUninitialized: true
 }));

 app.use(passport.initialize());
 app.use(passport.session());
 passport.serializeUser((user, cb) => cb(null, user));
 passport.deserializeUser((user, cb) => cb(null, user));
 passport.use(new WebAppStrategy({
     tenantId: process.env.TENANT_ID,
     clientId: process.env.CLIENT_ID,
     secret: process.env.SECRET,
     oauthServerUrl: process.env.AUTH_SERVER_URL,
     redirectUri: process.env.REDIRECT_URI
 }));

app.use(
  "/blogs",
  proxy({ target: "http://localhost:3000/", changeOrigin: true })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/node_modules/*", (req, res) => {
  res.sendFile(path.resolve(__dirname + req.path));
});

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get('/appid/logout', function(req, res){
	WebAppStrategy.logout(req);
	res.redirect('/');
});

// Protect the entire application
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use("/", express.static(path.join(__dirname + "/public")));


let port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
