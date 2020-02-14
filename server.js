const express = require("express");
const path = require("path");
const morgan = require("morgan");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(
  "/blogs",
  proxy({ target: "http://localhost:3000/", changeOrigin: true })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", express.static(path.join(__dirname + "/public")));

app.get("/node_modules/*", (req, res) => {
  res.sendFile(path.resolve(__dirname + req.path));
});

let port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
