import express from "express";
import morgan from "morgan";
import cors from "cors";
import pkg from "@prisma/client";
import fs from "fs";
import http from "http";
import https from "https";

// Server configuration
var port = 8000;
var options = {
    key: fs.readFileSync('./ssl/cert.key'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// DB interaction with prisma
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ping- pong
app.get("/ping", async (req, res) => {
    res.status(200).json("pong");
});

//create a user
app.post("/find", async (req, res) => {
  const { number } = req.body;
  if ( number === null) {
    return res.status(400).json("Null input");
  }

  const result = await prisma.test.findUnique({
    where: {
      test_column: number,
    },
  });

    res.status(200).json(result);
  }
);


https.createServer(options, app).listen(process.env.PORT || 8000, () => {
  console.log("Server running on https://localhost:8000 🎉 🚀");
});
