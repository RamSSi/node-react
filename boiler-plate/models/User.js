const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {    // 유효성 관리, 검사
        type: String
    },
    tokenExp: { // token 유효기간
        type: Number
    },
    image: String
});

userSchema.pre('save', function(next) { 
// mongoose 기능 : save 전에 함수 실행 후 next로 보낸다.
// 이때 next는 user.save()
    let user = this;    // userSchema
    
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
    } else {
        next();
    }
}); 

userSchema.methods.comparePassword = function(plainPassword, callback) {
    // planePassword 123456     // database의 암호화된 password "$2b$10$LpVwNTvDMWoiLaHh3TGIUeG8YHbweWlfaLe032yxqBq8BnW9uVogy"
    // 두 개가 같은지 확인! (plainPassword를 암호화하여 확인)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return callback(err);   // err가 발생하면 err 반환
        callback(null, isMatch);   // 비밀번호가 일치 > true
    });
};

userSchema.methods.generateToken = function(callback) {
    let user = this;
    // jsonwebtoken을 이용해 token 생성
    let token = jwt.sign(user._id.toHexString(), "secretToken");

    user.token = token;
    user.save(function(err, user) {
        if(err) return callback(err);
        callback(null, user);
    });
};

userSchema.statics.findByToken = function(token, callback) {
    let user = this;

    // token = user._id + 'secretToken'
    // token을 복호화한다.
    jwt.verify(token, "secretToken", function(err, decoded) {
        // user id를 통해 user를 찾고
        // client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({_id: decoded, token: token}, function(err, user) {
            if(err) return callback(err);
            callback(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);    // 스키마를 모델로 감싸줌

module.exports = { User };