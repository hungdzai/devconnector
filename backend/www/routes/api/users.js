"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const userAccess_1 = __importDefault(require("../../dataLayer/userAccess"));
const uuid = __importStar(require("uuid"));
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config_1 = require("../../config/config");
const { check, validationResult } = require("express-validator/check");
const User = require("../../models/User");
const userAccess = new userAccess_1.default();
// @route   GET api/users
// desc     Test route
// @access  Public
router.get("/", (req, res) => res.send("User route"));
// @route   POST api/users
// desc     Register user
// @access  Public
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        // See if user exists
        let user = yield userAccess.getUserByEmail(email);
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "User already exists" }] });
        }
        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
        });
        user = {
            userId: uuid.v4(),
            name,
            email,
            password,
            avatar,
            date: new Date().toISOString(),
        };
        // Encrypt password
        const salt = yield bcrypt.genSalt(10);
        user.password = yield bcrypt.hash(password, salt);
        // Save to database
        yield userAccess.createUser(user);
        // Return jsonwebtoken once registered
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
//# sourceMappingURL=users.js.map