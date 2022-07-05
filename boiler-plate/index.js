const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://kangaram:dkfka519!@boilerplate.d1ly0.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // root dir에 도달하면 응답 메시지 전달

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
