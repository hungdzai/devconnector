"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const config_1 = require("./config/config");
const AWS = __importStar(require("aws-sdk"));
AWS.config.update({
    region: process.env.REGION,
});
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const usersTableParams = {
    TableName: `DevConnector-Users-${config_1.config.stage}`,
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
};
const profilesTableParams = {
    TableName: `DevConnector-Profiles-${config_1.config.stage}`,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
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
};
const postsTableParams = {
    TableName: `DevConnector-Posts-${config_1.config.stage}`,
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
};
exports.connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dynamodb.createTable(usersTableParams).promise();
        console.log("Users table created");
    }
    catch (error) {
        if (error.name === "ResourceInUseException") {
            console.log(error.message);
        }
        else {
            throw error;
        }
    }
    try {
        yield dynamodb.createTable(profilesTableParams).promise();
        console.log("Profiles table created");
    }
    catch (error) {
        if (error.name === "ResourceInUseException") {
            console.log(error.message);
        }
    }
    try {
        yield dynamodb.createTable(postsTableParams).promise();
        console.log("Posts table created");
    }
    catch (error) {
        if (error.name === "ResourceInUseException") {
            console.log(error.message);
        }
    }
    console.log("DynamoDb connected ...");
});
//# sourceMappingURL=db.js.map