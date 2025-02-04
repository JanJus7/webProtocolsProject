import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import next from "next";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH),
};

app.prepare().then(() => {
  https
    .createServer(options, (req, res) => {
      handle(req, res);
    })
    .listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on https://localhost:3000");
    });
});