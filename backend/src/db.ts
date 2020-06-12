import { config } from "./config/config"
import * as AWS from "aws-sdk"

AWS.config.update({
  region: process.env.REGION,
})

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" })

const usersTableParams = {
  TableName: `DevConnector-Users-${config.stage}`,
  BillingMode: "PAY_PER_REQUEST",
  AttributeDefinitions: [
    {
      AttributeName: "email",
      AttributeType: "S",
    },
    {
      AttributeName: "userId",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "userId",
      KeyType: "HASH",
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "EmailIndex",
      KeySchema: [
        {
          AttributeName: "email",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
}

const profilesTableParams = {
  TableName: `DevConnector-Profiles-${config.stage}`,
  BillingMode: "PAY_PER_REQUEST",
  AttributeDefinitions: [
    {
      AttributeName: "user",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "user",
      KeyType: "HASH",
    },
  ],
}

const postsTableParams = {
  TableName: `DevConnector-Posts-${config.stage}`,
  BillingMode: "PAY_PER_REQUEST",
  AttributeDefinitions: [
    {
      AttributeName: "user",
      AttributeType: "S",
    },
    {
      AttributeName: "date",
      AttributeType: "S",
    },
    {
      AttributeName: "id",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "user",
      KeyType: "HASH",
    },
    {
      AttributeName: "date",
      KeyType: "RANGE",
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "IdIndex",
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
}

export const connectDB = async () => {
  try {
    await dynamodb.createTable(usersTableParams).promise()
    console.log("Users table created")
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(error.message)
    } else {
      throw error
    }
  }
  try {
    await dynamodb.createTable(profilesTableParams).promise()
    console.log("Profiles table created")
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(error.message)
    }
  }
  try {
    await dynamodb.createTable(postsTableParams).promise()
    console.log("Posts table created")
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(error.message)
    }
  }

  console.log("DynamoDb connected ...")
}
