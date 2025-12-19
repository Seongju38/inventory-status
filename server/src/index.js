require("dotenv").config();
const express = require("express");
const cors = require("cors");
const itemsRouter = require("./routes/items");
const { errorHandler } = require("./middleware/error");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api/items", itemsRouter);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
