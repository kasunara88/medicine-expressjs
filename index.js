require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;
const path = require("path");
const { authGuard } = require("./controller/utill/auth-guard");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/json
//app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const medicineRoute = require("./routes/medicine-route");
const userRoute = require("./routes/user-route");

app.use("/api/v1/medicines", authGuard, medicineRoute);
app.use("/api/v1/user", userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
