const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const app = express();
const result = dotenv.config();
const session = require("express-session");
const log4js = require("log4js");
const passport = require("passport");
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const logger = log4js.getLogger("blog");
const multer = require("multer");

const upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
passport.use(
  new WebAppStrategy({
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    oauthServerUrl: process.env.AUTH_SERVER_URL,
    redirectUri: process.env.REDIRECT_URI,
  })
);

const restream = async (proxyReq, req, res, options) => {
  if (req.user) {
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].match(/^multipart\/form-data/)
    ) {
      proxyReq.socket.pause();
      // build a string in multipart/form-data format with the data you need
      const formdataUser =
        `--${req.headers["content-type"].replace(
          /^.*boundary=(.*)$/,
          "$1"
        )}\r\n` +
        `Content-Disposition: form-data; name="reqUser"\r\n` +
        `\r\n` +
        `${JSON.stringify(req.user)}\r\n`;

      // set the new content length
      await proxyReq.setHeader(
        "Content-Length",
        parseInt(req.headers["content-length"]) + formdataUser.length
      );

      await proxyReq.write(formdataUser);
      proxyReq.socket.resume();
      // await proxyReq.end();
    }
  }
};

// proxy middleware options
const proxyOptions = {
  target: "http://localhost:3000", // target host
  changeOrigin: true, // needed for virtual hosted sites
  pathRewrite: {
    "^/api": "",
  },
};

// create the proxy (without context)
const apiProxy = createProxyMiddleware(proxyOptions);
app.use(
  "/api",
  upload.single("file"),
  // (req, res, next) => {
  //   console.log(req.user, req.body.email);
  //   if (req.body.email === req.user.email) {
  //     next();
  //   } else {
  //     res.status(432).send("invalid user");
  //     res.end();
  //   }
  // },
  apiProxy
);

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.get("/node_modules/*", (req, res) => {
  res.sendFile(path.resolve(__dirname + req.path));
});

// Handle callback
app.get("/appid/callback", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Handle logout
app.get("/appid/logout", function(req, res) {
  WebAppStrategy.logout(req);
  res.redirect("/");
});

// Return an object 'roles' of the user's permissions (App ID scopes)
const getUserScopes = (req) => ({
  update_guidelines: WebAppStrategy.hasScope(req, "update_guidelines"),
  manage_blogs: WebAppStrategy.hasScope(req, "manage_blogs"),
  manage_appid: WebAppStrategy.hasScope(req, "manage_appid"),
});

// Handle Requests for App Id user credentials
app.get("/user", function(req, res) {
  // If App Id is disabled for dev purposes send placeholder credentials
  if (process.env.AUTH_DISABLED) {
    res.json({
      email: "ExampleUser@email.com",
      name: "Example User",
      scopes: {
        manage_blogs: true,
        manage_appid: true,
        update_guidelines: true,
      },
    });
  } else {
    const { given_name, family_name, email } = req.user;
    res.json({
      email,
      name: `${given_name} ${family_name}`,
      scopes: getUserScopes(req),
    });
  }
});

// Protect the entire application with App Id
process.env.AUTH_DISABLED
  ? console.log("app id disabled")
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
