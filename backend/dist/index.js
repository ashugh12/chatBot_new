"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const connection_js_1 = __importDefault(require("./db/connection.js"));
//connections and listeners
(0, connection_js_1.default)().then(() => {
    app_js_1.default.listen((process.env.PORT || 4000), () => console.log("Server Open and connected to database 🤝"));
}).catch((err) => { console.log(err); });
//# sourceMappingURL=index.js.map