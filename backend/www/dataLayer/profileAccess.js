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
class ProfileAccess {
    constructor(docClient = new AWS.DynamoDB.DocumentClient(), table = `DevConnector-Profiles-${stage}`) {
        this.docClient = docClient;
        this.table = table;
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient
                .query({
                TableName: this.table,
                KeyConditionExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": userId,
                },
            })
                .promise();
            const profile = result.Items[0];
            return profile;
        });
    }
    createProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.docClient
                    .put({
                    TableName: this.table,
                    Item: profile,
                })
                    .promise();
                console.log("Profile updated");
                return undefined;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.docClient
                .scan({
                TableName: this.table,
            })
                .promise();
            const profiles = result.Items;
            return profiles;
        });
    }
    deleteProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.docClient
                .delete({
                TableName: this.table,
                Key: {
                    user,
                },
            })
                .promise();
            return undefined;
        });
    }
}
exports.default = ProfileAccess;
//# sourceMappingURL=profileAccess.js.map