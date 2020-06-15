"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv").config();
// load env
exports.config = {
    region: process.env.REGION,
    stage: process.env.STAGE,
    jwt_secret: process.env.JWT_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_SECRET,
};
//# sourceMappingURL=config.js.map