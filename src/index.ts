import express from "express";

const port = 4000;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ solde: true });
});

app.listen(port);
