import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// ping- pong
app.get("/ping", async (req, res) => {
    res.status(200).json("pong");
});

//create a user
app.post("/invert", async (req, res) => {
  const { word } = req.body;
  if ( word === null) {
    return res.status(400).json("Null input");
  }

  var inverted = ""

  for (var i = word.length - 1; i >= 0; i--) { 
    inverted += word[i];
  }

    res.status(200).json(inverted);
  }
);


app.listen(process.env.PORT || 8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
