const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리 기능

    // 1. Client cookie에서 token을 가져온다.
    let token = req.cookies.x_auth;

    // 2. token을 decode(복호화)하여 user를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        console.log('req.user', req.user);
        if (!user) return res.json({ isAuth: false, error: true });

        // 정보를 index.js에서 사용할 수 있도록 넣어줌
        req.token = token;
        req.user = user;

        next(); // middleware를 끝내고 다음으로 넘어가기 위해
    });

    // user가 있으면 인증 Ok

    // user가 없으면 인증 no
};

module.exports = { auth };
