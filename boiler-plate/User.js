const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // ex. john ahn@naver.com 내의 공백 제거
        unique: 1   // 이메일 중복 불가
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {    // 유효성 관리, 검사
        type: String
    },
    tokenExp: { // token 유효기간
        type: Number
    }
});

const User = mongoose.model('User', userSchema);    // 스키마를 모델로 감싸줌

module.exports = { User }