// backend apis
console.log("server started ")
const express = require("express");
const cors = require("cors");
// const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
