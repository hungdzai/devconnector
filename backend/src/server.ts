import express from "express"
import { connectDB } from "./db"
import { Request, Response } from "express"
// Connect database
connectDB()

const port = process.env.PORT || 5000
const app = express()
// Init Middleware
app.use(express.json())

//CORS Should be restricted
app.use(function (req: Request, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  )
  next()
})

// Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/auth", require("./routes/api/auth"))

app.get("/", (req: Request, res: Response) => {
  res.send("/api/")
})
app.listen(port, () => console.log(`Server running on port ${port}`))
