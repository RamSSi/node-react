const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

userSchema.pre('save', function(next) { 
// mongoose 기능 : save 전에 함수 실행 후 next로 보낸다.
// 이때 next는 user.save()
    var user = this;    // userSchema
    
    if(user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            // salt를 얻음
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                // salt를 통해 비밀번호 암호화
                if(err) return next(err);
                user.password = hash; // 사용자가 입력한 패스워드를 암호화된 비밀번호로 바꾸어 줌
                next();
            });
        });
    }
}); 

const User = mongoose.model('User', userSchema);    // 스키마를 모델로 감싸줌

module.exports = { User }