const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const app = express();

// can remove latter two statements when project is ready for submission

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB", r);
  },
  (e) => console.log("DB error", e),
);

// hard-coded user
// app.use((req, res, next) => {
//   req.user = {
//     _id: "655a9b779a5a9b52a93a66d4",
//   };
//   next();
// });
app.use(cors());
app.use(express.json());
const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
