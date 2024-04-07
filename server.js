const express = require("express");
const db = require("./src/app/services/db");

const app = express();
const PORT = 3000;

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
