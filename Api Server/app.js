const express = require("express");
const morgan = require("morgan");
const cors =  require("cors");
const pkg = require("@prisma/client");
const fs =require("fs");


// Server configuration
const options = {
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
app.post("/add_sensor_record", async (req, res) => {
  const { time, temperature, humidity } = req.body;
  if ( time === null || temperature === null) {
    return res.status(400).json("Null input");
  }

  try {
    const result = await prisma.sensor_data.create({
      data: {
        time: time,
        temperature: temperature,
        humidity: humidity
      },
    });
    res.status(200).json("Record at time ".concat(time).concat(" inserted succesfully."));
  }
  catch {
    res.status(400).json("Bad request.");
  }
  }
);


module.exports = {
    app: app, 
    options: options};
//module.exports = options
//export {app, options}