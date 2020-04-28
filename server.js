const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const proxy = require("http-proxy-middleware");
const bodyParser = require('body-parser');

const app = express();

const result = dotenv.config();
const session = require('express-session');
const log4js = require('log4js');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const logger = log4js.getLogger('blog');

app.use(bodyParser.json());

app.use(session({
  secret: '123456',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => {
  cb(null, user)
});
passport.deserializeUser((user, cb) => {
  cb(null, user)
});
passport.use(new WebAppStrategy({
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  oauthServerUrl: process.env.AUTH_SERVER_URL,
  redirectUri: process.env.REDIRECT_URI
}));

app.use(
  "/api",
  proxy({
    target: "http://localhost:3000/",
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    onProxyReq(proxyReq, req, res) {
      if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
        // get name from app id passport middleware
        const { given_name, family_name, email } = req.user;
        const name = `${given_name} ${family_name}`;

        // Make any needed POST parameter changes
        let { body } = req;
        body.name = name;
        body.email = email;

        // URI encode JSON object
        body = Object.keys(body)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
          .join('&');

        // Update header
        proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded');
        proxyReq.setHeader('content-length', body.length);

        // Write out body changes to the proxyReq stream
        proxyReq.write(body);
        proxyReq.end();
      }
    }
  })
);

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.get("/node_modules/*", (req, res) => {
  res.sendFile(path.resolve(__dirname + req.path));
});

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get('/appid/logout', function (req, res) {
  WebAppStrategy.logout(req);
  res.redirect('/');
});

// Return an object 'roles' of the user's permissions (App ID scopes)
const getUserScopes = (req) => ({
  update_guidelines: WebAppStrategy.hasScope(req, "update_guidelines"),
  manage_blogs: WebAppStrategy.hasScope(req, "manage_blogs"),
  manage_appid: WebAppStrategy.hasScope(req, "manage_appid")
});

// Handle Requests for App Id user credentials
app.get('/user', function (req, res) {
  // If App Id is disabled for dev purposes send placeholder credentials
  if (process.env.AUTH_DISABLED) {
    res.json({
      email: 'ExampleUser@email.com',
      name: 'Example User',
      scopes: {
        "manage_blogs": true,
        "manage_appid": true,
        "update_guidelines": true,
      }
    });
  }
  else {
    const { given_name, family_name, email } = req.user
    res.json({
      email,
      name: `${given_name} ${family_name}`,
      scopes: getUserScopes(req)
    });
  }
});

// Protect the entire application with App Id
process.env.AUTH_DISABLED
  ? console.log('app id disabled')
  : app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use("/", express.static(path.join(`${__dirname}/public`)));
app.get("*/bundle.js", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/public/bundle.js`));
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/public/index.html`));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});