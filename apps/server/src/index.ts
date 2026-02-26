// importing dotenv for environment
import dotenv from "dotenv";
dotenv.config();

import { connectToDataBase } from "./db/connection.js";
import { verifyEmailConnection } from "./config/email.config.js";
import { app } from "./app.js";
const PORT = process.env.PORT;

await connectToDataBase();
await verifyEmailConnection(); // Verify email configuration on startup

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
