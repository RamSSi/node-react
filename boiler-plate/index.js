const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const { user, User } = require("./models/User");

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있음
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형식의 데이터를 분석(parse)하여 가져올 수 있음
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://kangaram:dkfka519!@boilerplate.d1ly0.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // root dir에 도달하면 응답 메시지 전달

app.post("/register", (req, res) => {
    // 회원가입을 할 때 필요한 정보들을 Client에서 가져오면
    // 데이터 베이스에 넣어줌
    const user = new User(req.body);
    // bodyParser를 이용해 req.body에 request body를 받아올 수 있음

    // save 전에 암호화 필요
    
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
