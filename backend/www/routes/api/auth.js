"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const requireAuth_1 = __importDefault(require("../../middleware/requireAuth"));
const config_1 = require("../../config/config");
const userAccess_1 = __importDefault(require("../../dataLayer/userAccess"));
const userAccess = new userAccess_1.default();
// @route   GET api/auth
// desc     Test route
// @access  Public
router.get("/", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userAccess.getUserById(req.user.id);
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})); //use auth middleware
// @route   POST api/auth
// desc     Authenticate user & get token
// @access  Public
router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // See if user exists
        let user = yield userAccess.getUserByEmail(email);
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }
        // if user registed, compare password
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
        }
        const payload = {
            user: {
                id: user.userId,
            },
        };
        const secret = config_1.config.jwt_secret;
        jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map