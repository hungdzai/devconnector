const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator/check")
import requireAuth from "../../middleware/requireAuth"
import { config } from "../../config/config"
import UserAccess from "../../dataLayer/userAccess"
import { Response } from "express"
import CustomRequest from "../../models/CustomRequest"

const userAccess = new UserAccess()

// @route   GET api/auth
// desc     Test route
// @access  Public
router.get("/", requireAuth, async (req: CustomRequest, res: Response) => {
  try {
    const user = await userAccess.getUserById(req.user.id)
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server Error")
  }
}) //use auth middleware

// @route   POST api/auth
// desc     Authenticate user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req: CustomRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
      // See if user exists
      let user = await userAccess.getUserByEmail(email)
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] })
      }
      // if user registed, compare password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] })
      }
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
