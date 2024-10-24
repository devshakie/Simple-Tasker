"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
router.post("/register", [
    (0, express_validator_1.check)("name", "Name is required").not().isEmpty(),
    (0, express_validator_1.check)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password must be 6 or more characters").isLength({
        min: 6,
    }),
    (0, express_validator_1.check)("role", "Role must be either Admin or Team Member").isIn([
        "Admin",
        "Team Member",
    ]),
], AuthController_1.register);
router.post("/login", AuthController_1.login);
exports.default = router;
