console.log ("Started...")

import 'dotenv/config'
import { connectDB } from "./db/index.js";
import { app} from "./app.js"
//dotenv.config({ path: './.env' });

await connectDB()
.then(() => {
    console.log("PORT from env:", process.env.PORT);
    app.listen(process.env.PORT || 8000, () => {
        console.log(`🚀 Server is running at port: ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("❌ Failed to connect to the database", err);
});
