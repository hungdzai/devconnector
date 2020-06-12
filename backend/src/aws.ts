import * as AWS from "aws-sdk"
import { config } from "./config/config"

//Configure AWS
const credentials = new AWS.SharedIniFileCredentials({ profile: "default" })

AWS.config.credentials = credentials
