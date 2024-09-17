const Express = require("express");
const { login, signup } = require("../controller/auth");
const router = Express.Router();


router.post("/login", login);
router.post("/signup", signup)

module.exports = router