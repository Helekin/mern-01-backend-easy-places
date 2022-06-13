require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");

const HttpError = require("./middleware/http-error");

connectDB();

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error ocurred" });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
