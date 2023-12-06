const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
