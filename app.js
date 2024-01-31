require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { errorHandler } = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

app.use(cors());
app.use(express.json());
const routes = require("./routes");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
