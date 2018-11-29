const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema(
    {
        user: {
            type: String,
        },
        code: {
            type: String,
        }
    }, {
        versionKey: false
    }
);


var VerificationCode = mongoose.model("code", VerificationCodeSchema);


module.exports = {
    VerificationCode
};
