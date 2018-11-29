const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var secret = process.env.secret_token;

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is Required']
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            // required: true,
            trim: true,
            minlength: 1,
            validate: {
                validator: validator.isEmail,
                message: "{VALUE} is not a valid email"
            },
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        active: Boolean
    }, {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.pre('save', function (next) {
    if (!!this.password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, secret);
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (!user) {
                return Promise.reject();
            } else {
                return Promise.resolve(user);
            }
        })
        .catch(e => {
            res.status(401).end(e.message);
        });
};

var User = mongoose.model("User", UserSchema);


module.exports = {
    User
};
