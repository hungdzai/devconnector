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
const request = require("request");
const uuid = require("uuid");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const profileAccess_1 = __importDefault(require("../../dataLayer/profileAccess"));
const userAccess_1 = __importDefault(require("../../dataLayer/userAccess"));
const requireAuth_1 = __importDefault(require("../../middleware/requireAuth"));
const config_1 = require("../../config/config");
const profileAccess = new profileAccess_1.default();
const userAccess = new userAccess_1.default();
// @route   GET api/profile/me
// desc     Get current user profile
// @access  Private
router.get("/me", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const profile = yield profileAccess.getProfile(user);
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   POST api/profile
// desc     Create or update current user profile
// @access  Private
router.post("/", [
    requireAuth_1.default,
    [
        check("status", "Status is required").not().isEmpty(),
        check("skills", "Skills is required").not().isEmpty(),
    ],
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin, } = req.body;
    // Build profile object
    const profileFields = {};
    profileFields.userId = req.user.id;
    const user = yield userAccess.getUserById(profileFields.userId);
    profileFields.user = user;
    profileFields.date = new Date().toISOString();
    profileFields.company = company;
    profileFields.website = website;
    profileFields.location = location;
    profileFields.bio = bio;
    profileFields.status = status;
    profileFields.githubusername = githubusername;
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
    // Build social object
    profileFields.social = {};
    profileFields.social.youtube = youtube;
    profileFields.social.twitter = twitter;
    profileFields.social.facebook = facebook;
    profileFields.social.linkedin = linkedin;
    profileFields.social.instagram = instagram;
    profileFields.education = [];
    profileFields.experience = [];
    try {
        // Create || Update
        yield profileAccess.createProfile(profileFields);
        res.json(profileFields);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   GET api/profile
// desc     Get all profiles
// @access  Public
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield profileAccess.getProfiles();
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   GET api/profile/user/:user_id
// desc     Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.params.user_id;
        const profile = yield profileAccess.getProfile(user);
        if (!profile)
            return res.status(400).json({ msg: "Profile not found" });
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   GET api/profile
// desc     Delete profile, user & posts
// @access  Private
router.delete("/", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        // Remove user posts
        // await Post.deleteMany({ user: req.user.id })
        // Remove profile
        yield profileAccess.deleteProfile(user);
        // Remove user
        yield userAccess.deleteUser(user);
        res.json({ msg: "User deleted" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   PUT api/profile/experience
// desc     Add profile experience
// @access  Private
router.put("/experience", [
    requireAuth_1.default,
    [
        check("title", "Title is required").not().isEmpty(),
        check("company", "Company is required").not().isEmpty(),
        check("from", "From date is required").not().isEmpty(),
    ],
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description, } = req.body;
    const newExp = {
        id: uuid.v4(),
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    };
    try {
        const user = req.user.id;
        const profile = yield profileAccess.getProfile(user);
        profile.experience.unshift(newExp);
        yield profileAccess.createProfile(profile);
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   DELETE api/profile/experience/:exp_id
// desc     Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const profile = yield profileAccess.getProfile(user);
        // Get remove index
        const removeIndex = profile.experience
            .map((item) => item.id)
            .indexOf(req.params.exp_id);
        if (removeIndex < 0) {
            throw Error("Not found exp_id ");
        }
        profile.experience.splice(removeIndex, 1);
        yield profileAccess.createProfile(profile);
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   PUT api/profile/education
// desc     Add profile education
// @access  Private
router.put("/education", [
    requireAuth_1.default,
    [
        check("school", "School is required").not().isEmpty(),
        check("degree", "Degree is required").not().isEmpty(),
        check("fieldofstudy", "Field of study is required").not().isEmpty(),
        check("from", "From date is required").not().isEmpty(),
    ],
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description, } = req.body;
    const newEdu = {
        id: uuid.v4(),
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    };
    try {
        const user = req.user.id;
        const profile = yield profileAccess.getProfile(user);
        profile.education.unshift(newEdu);
        yield profileAccess.createProfile(profile);
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   DELETE api/profile/education/:edu_id
// desc     Delete education from profile
// @access  Private
router.delete("/education/:edu_id", requireAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const profile = yield profileAccess.getProfile(user);
        // Get remove index
        const removeIndex = profile.education
            .map((item) => item.id)
            .indexOf(req.params.edu_id);
        if (removeIndex < 0) {
            throw Error("Not found edu_id ");
        }
        profile.education.splice(removeIndex, 1);
        yield profileAccess.createProfile(profile);
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}));
// @route   GET api/profile/github/:username
// desc     Get user repos from Github
// @access  Public
router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config_1.config.githubClientId}&client_secret=${config_1.config.githubSecret}`,
            method: "GET",
            headers: { "user-agent": "node.js" },
        };
        request(options, (error, response, body) => {
            if (error)
                console.error(error);
            if (response.statusCode != 200) {
                return res.status(404).json({ msg: "No Github profile found" });
            }
            res.json(JSON.parse(body));
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
//# sourceMappingURL=profile.js.map