import "reflect-metadata";
import { app } from "./app";
import { logger } from "./logger";
import * as dotenv from "dotenv";
dotenv.config()

const port = parseInt(process.env.APP_PORT || "8000", 10);
const host = process.env.APP_HOST || "0.0.0.0";

app.listen(port, host, () => {
    //if (err) throw err;
    logger.info("Server running on port", port);
});
