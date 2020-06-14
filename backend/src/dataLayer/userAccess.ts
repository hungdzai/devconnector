import * as AWS from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import User from "../models/User"
import { config } from "../config/config"

const stage = config.stage

export default class UserAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly table = `DevConnector-Users-${stage}`
  ) {}

  async getUsers() {
    const result = await this.docClient
      .scan({
        TableName: this.table,
      })
      .promise()
    const users = result.Items
    return users as User[]
  }

  async getUserById(userId: string): Promise<User> {
    const result = await this.docClient
      .query({
        TableName: this.table,
        KeyConditionExpression: "userId=:userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise()
    const user = result.Items[0]
    return user as User
  }

  async getUserByEmail(email: string) {
    try {
      const result = await this.docClient
        .query({
          TableName: this.table,
          IndexName: "EmailIndex",
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
        })
        .promise()
      const user = result.Items[0]
      return user as User
    } catch (e) {
      return undefined
    }
  }

  async createUser(user: User) {
    await this.docClient
      .put({
        TableName: this.table,
        Item: user,
      })
      .promise()
    return undefined
  }

  async deleteUser(userId: string) {
    await this.docClient
      .delete({
        TableName: this.table,
        Key: {
          userId,
        },
      })
      .promise()
    return undefined
  }
}
