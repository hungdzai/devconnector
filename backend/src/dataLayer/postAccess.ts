import * as AWS from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { config } from "../config/config"
import Post from "../models/Post"

const stage = config.stage

export default class PostAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly table = `DevConnector-Posts-${stage}`
  ) {}

  async getPostById(id: string) {
    const result = await this.docClient
      .query({
        TableName: this.table,
        IndexName: "IdIndex",
        KeyConditionExpression: "id=:id",
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise()
    const post = result.Items[0]
    return post as Post
  }

  async getPosts() {
    const result = await this.docClient
      .scan({
        TableName: this.table,
      })
      .promise()
    const profile = result.Items
    return profile as Post[]
  }

  async createPost(post: Post) {
    try {
      await this.docClient
        .put({
          TableName: this.table,
          Item: post,
        })
        .promise()
      console.log("Post updated")
      return undefined
    } catch (error) {
      console.error(error)
    }
  }

  async deletePost(user: string, date: string) {
    await this.docClient
      .delete({
        TableName: this.table,
        Key: {
          user,
          date,
        },
      })
      .promise()
    return undefined
  }
}
