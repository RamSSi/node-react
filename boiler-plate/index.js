const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {
    auth
} = require("./middleware/auth");

const {
    user,
    User
} = require("./models/User");

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있음
app.use(bodyParser.urlencoded({
    extended: true
}));
// application/json 형식의 데이터를 분석(parse)하여 가져올 수 있음
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://kangaram:dkfka519!@boilerplate.d1ly0.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // root dir에 도달하면 응답 메시지 전달

app.post("/api/users/register", (req, res) => {
    // 회원가입을 할 때 필요한 정보들을 Client에서 가져오면
    // 데이터 베이스에 넣어줌
    const user = new User(req.body);
    // bodyParser를 이용해 req.body에 request body를 받아올 수 있음

    // save 전에 암호화 필요

    user.save((err, userInfo) => {
        if (err) return res.json({
            success: false,
            err
        });
        return res.status(200).json({
            success: true,
        });
    });
});

app.post('/api/users/login', (req, res) => {
    // 1. 요청된 email을 데이터베이스에서 있는지 찾는다.
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        // 찾을 수 없으면 err, response 반환
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 2. 요청된 email이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });

            // 3. 비밀번호가 맞으면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 쿠키 or 로컬 스토리지에 토큰을 저장한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            });
        });
    })
});


// 인증 과정은 매우 복잡
app.get("/api/users/auth", auth, (req, res) => { // auth middleware : endpoint에서 request를 받은 후 callback 함수를 호출하기 전에 기능을 추가해줌
    // middleware를 통과해왔음!
    // = Authentication이 True

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        // user의 권한 : role !== 0이면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
}) // get request

app.get("/api/users/logout", auth, (req, res) => {
    console.log('req.user', req.user);
    User.findOneAndUpdate(
        {_id: req.user._id}, {token: ""},
        (err, user) => {
            if (err) return res.json({success: false, err});
            return res.status(200).send({success: true});
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
