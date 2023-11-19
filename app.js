const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;

const app = express();

//can remove latter two statements when project is ready for submission
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

app.use(express.json());
const routes = require("./routes");
app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
