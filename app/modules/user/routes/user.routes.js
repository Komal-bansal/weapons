const { Router } = require("express"),
    userRouter = Router(),
    { user_register, user_login, user_verify } = require("../../user/controllers/user.controller");

userRouter.post("/register", user_register);
userRouter.post("/login", user_login);
userRouter.get("/verify", user_verify);
// userRouter.post("/social", social_login);
// router.get("/", function (req, res) {
//     res.send('loggen in')
// })

module.exports = {
    userRouter
};
