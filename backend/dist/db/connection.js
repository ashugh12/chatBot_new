"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
async function connectToDatabase() {
    try {
        await (0, mongoose_1.connect)(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error('Cannot connect to MongoDb');
    }
}
exports.default = connectToDatabase;
async function disconnectFromDatabase() {
    try {
        await (0, mongoose_1.disconnect)();
    }
    catch (error) {
        console.log(error);
        throw new Error('Cannot disconnect to MongoDb');
    }
}
//# sourceMappingURL=connection.js.map