import * as express from "express"
import { connectDB } from "./db"

// Connect database
connectDB()

const port = process.env.PORT || 5000
const app = express()
// Init Middleware
app.use(express.json())

//CORS Should be restricted
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  next()
})

// Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/profile", require("./routes/api/profile"))
// app.use("/api/posts", require("./routes/api/posts"))
app.use("/api/auth", require("./routes/api/auth"))

app.get("/", (req, res) => {
  res.send("/api/")
})
app.listen(port, () => console.log(`Server running on port ${port}`))
