const express = require("express");
const app = express();
import configViewEngine from "./configs/viewEngine";
import dotenv from "dotenv";
import initWebRoute from "./route/webRoute";
dotenv.config();
const port = process.env.PORT || 6000;

// ========= config redis =============
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()) //cookie-parser dùng để đọc cookies của request:
app.use(cors({
    origin: 'http://127.0.0.1:3000', //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))
// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize sesssion storage.

app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
  })
);
// all routes
app.use("*", function (req, res, next) {
  // gan vao bien  locals de cac trang views deu nhan duoc
  // thong tin user
  res.locals.user = req?.session?.user || null;
  console.log("res.locals: ", res.locals);
  next();
});
// ========= config redis =============

configViewEngine(app);
initWebRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
