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
const AWS = __importStar(require("aws-sdk"));
const config_1 = require("../config/config");
const stage = config_1.config.stage;
class UserAccess {
    constructor(docClient = new AWS.DynamoDB.DocumentClient(), table = `DevConnector-Users-${stage}`) {
        this.docClient = docClient;
        this.table = table;
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient
                .scan({
                TableName: this.table,
            })
                .promise();
            const users = result.Items;
            return users;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient
                .query({
                TableName: this.table,
                KeyConditionExpression: "userId=:userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            })
                .promise();
            const user = result.Items[0];
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.docClient
                    .query({
                    TableName: this.table,
                    IndexName: "EmailIndex",
                    KeyConditionExpression: "email = :email",
                    ExpressionAttributeValues: {
                        ":email": email,
                    },
                })
                    .promise();
                const user = result.Items[0];
                return user;
            }
            catch (e) {
                return undefined;
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.docClient
                .put({
                TableName: this.table,
                Item: user,
            })
                .promise();
            return undefined;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.docClient
                .delete({
                TableName: this.table,
                Key: {
                    userId,
                },
            })
                .promise();
            return undefined;
        });
    }
}
exports.default = UserAccess;
//# sourceMappingURL=userAccess.js.map