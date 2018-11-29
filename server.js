const express = require("express"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    { env } = require("./environment/environment"),
    { userRouter } = require("./app/modules/user/routes/user.routes"),

    db = require("./db/mongoose"),
    port = process.env.PORT,
    app = express();

app.use(bodyParser.json());

app.use(cors());
app.use("/", userRouter);

app.listen(port, () => {
    console.log(`Server started at  ${port}, ${process.env.NODE_ENV}, ${process.env.MONGODB_URI}`);
});