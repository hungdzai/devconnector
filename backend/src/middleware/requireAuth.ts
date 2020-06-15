// middleware to validate the token in the request header and return the user object to the req to the next callback function
import { config } from "../config/config"
import * as jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import CustomRequest from "../models/CustomRequest"

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  // Get token from the header
  const token = req.header("x-auth-token")
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" })
  }
  // Verify token
  try {
    const secret = config.jwt_secret
    const decoded = jwt.verify(token, secret) as any
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}
