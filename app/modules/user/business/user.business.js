const { msg } = require("../../../config/messages"),
    { User } = require("../models/user.model"),
    { pickUserProfileResponse, pickRegistrationData, pickRegistrationResponse, pickUserCredentials, pickSociailAccountCredentials } = require("../../../helpers/pickResponse.helper"),
    { compare } = require("bcrypt"),
    { generateAuthToken } = require("../../../util/generate.token"),
    { socialloginResonse } = require("../../../helpers/commonResponse.helper"),
    nodemailer = require('nodemailer'),
    { VerificationCode } = require('../models/verificationCode.model');

// registration
const registration = async (req, res) => {
    req.body.active = false;
    let body = req.body;
    let userExist = await User.findOne({ email: body.email });
    if (userExist) {
        throw msg.duplicateEmail;
    }
    if (!body.password) {
        throw msg.passwordRequired
    }
    if (!body.name) {
        throw msg.userRequired
    }
    if (!body.publicKey) {
        throw msg.publicKeyRequired
    }
    let user = new User(body);
    let response = await user.save();
    sendMail(req, res, response.id);
    if (response) return {
        result: pickRegistrationResponse(response),
        status: 200,
        message: msg.userRegistered
    };
};


// login
const login = async (data) => {
    var body = pickUserCredentials(data);
    let user = await User.findOne({ email: body.email })
    if (!user) {
        throw msg.userNotFound;
    }
    if (!user.active) {
        throw msg.notVerifiedUser;
    }
    if (!user.password) {
        throw msg.passworNotSet
    }
    let verifiedPassword = await compare(body.password, user.password)

    if (!verifiedPassword) {
        throw msg.invalidCredentials
    } else {
        return {
            result: pickUserProfileResponse(user),
            status: 200,
            token: await generateAuthToken(user),
            message: msg.loggedIn
        };
    }
}

const verify = async (req, res) => {
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        var code = await VerificationCode.findOne({ code: req.query.id });
        console.log(code);
        if (code) {
            let a = await User.findByIdAndUpdate(code.user, { active: true });
            let b = await VerificationCode.findByIdAndDelete(code.id);
            return 'Domain is matched. Information is from authentic email';
        }
        else {
            throw 'bad request'
        }
    }
    else {
        throw 'bad request'
    }
}


const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "blockchain.parangat@gmail.com",
        pass: "demo@1234"
    }
});
var rand, mailOptions, host, link;

sendMail = async (req, res, id) => {
    rand = Math.floor((Math.random() * 10000) + 4);
    var data = {
        code: `${rand}_${id}`,
        user: id
    }
    var verification = new VerificationCode(data);
    let response = await verification.save();
    console.log(response);
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + rand + '_' + id;
    mailOptions = {
        to: req.body.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br>Welcome to our new weapons app. Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
}


module.exports = {
    registration,
    login,
    verify
};
