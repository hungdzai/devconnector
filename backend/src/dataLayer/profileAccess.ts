import * as AWS from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { config } from "../config/config"
import Profile from "../models/Profile"

const stage = config.stage

export default class ProfileAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly table = `DevConnector-Profiles-${stage}`
  ) {}

  async getProfile(userId: string) {
    const result = await this.docClient
      .query({
        TableName: this.table,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise()
    const profile = result.Items[0]
    return profile as Profile
  }

  async createProfile(profile: Profile) {
    try {
      await this.docClient
        .put({
          TableName: this.table,
          Item: profile,
        })
        .promise()
      console.log("Profile updated")
      return undefined
    } catch (error) {
      console.error(error)
    }
  }

  async getProfiles() {
    const result = await this.docClient
      .scan({
        TableName: this.table,
      })
      .promise()
    const profiles = result.Items
    return profiles as Profile[]
  }

  async deleteProfile(user: string) {
    await this.docClient
      .delete({
        TableName: this.table,
        Key: {
          user,
        },
      })
      .promise()
    return undefined
  }
}
