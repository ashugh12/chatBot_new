import app from "./app.js";
import connectToDatabase from "./db/connection.js";
//connections and listeners
connectToDatabase().then(() => {
    app.listen((process.env.PORT || 4000), () => console.log("Server Open and connected to database 🤝"));
}).catch((err) => { console.log(err); });
//# sourceMappingURL=index.js.map