require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initialise } = require("./db");
const articlesRouter = require("./routes/articles");

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/articles", articlesRouter);

initialise()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialise database", error);
    process.exit(1);
  });
