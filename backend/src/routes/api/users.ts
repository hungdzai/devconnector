import User from "../../models/User"
import UserAccess from "../../dataLayer/userAccess"
import * as uuid from "uuid"
const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const gravatar = require("gravatar")
const jwt = require("jsonwebtoken")
import { config } from "../../config/config"
const { check, validationResult } = require("express-validator/check")
import { Response } from "express"
import CustomRequest from "../../models/CustomRequest"
const User = require("../../models/User")

const userAccess = new UserAccess()

// @route   GET api/users
// desc     Test route
// @access  Public
router.get("/", (req: CustomRequest, res: Response) => res.send("User route"))

// @route   POST api/users
// desc     Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: CustomRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body

    try {
      // See if user exists
      let user: User = await userAccess.getUserByEmail(email)
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] })
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      })

      user = {
        userId: uuid.v4(),
        name,
        email,
        password,
        avatar,
        date: new Date().toISOString(),
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // Save to database
      await userAccess.createUser(user)

      // Return jsonwebtoken once registered
      const payload = {
        user: {
          id: user.userId,
        },
      }
      const secret = config.jwt_secret

      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  }
)

module.exports = router
