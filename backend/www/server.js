"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
// Connect database
db_1.connectDB();
const port = process.env.PORT || 8080;
const app = express_1.default();
// Init Middleware
app.use(express_1.default.json());
//CORS Should be restricted
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));
app.get("/", (req, res) => {
    res.send("/api/");
});
app.listen(port, () => console.log(`Server running on port ${port}`));
//# sourceMappingURL=server.js.map