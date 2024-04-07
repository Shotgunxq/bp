const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/test/api", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM easy_exercises");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
