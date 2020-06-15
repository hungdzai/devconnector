require("dotenv").config()
// load env
export const config = {
  region: process.env.REGION,
  stage: process.env.STAGE,
  jwt_secret: process.env.JWT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
}
