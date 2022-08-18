import * as bodyParser from "body-parser";
import { NextFunction, Response, Request } from "express";
import * as morgan from "morgan";
import { logger } from "./logger";
import * as cors from "cors";
import * as helmet from "helmet";
import { ErrorRequestHandler } from "express-serve-static-core";
import { InversifyExpressServer } from "inversify-express-utils";
import { JSONParseError } from "./utilities/customError";
import { reconnectDb } from "./utilities/db";
import * as fileUpload from "express-fileupload";
import { clientContainer } from "./client/client.container";
import { adminContainer } from "./admin/admin.container";
const express = require("express");
import * as dotenv from "dotenv";
dotenv.config()

const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if ((err as JSONParseError) instanceof SyntaxError && err.status === 400) {
        err.httpStatusCode = 400;
        logger.info("JSON error:", err.message);
        err.message = `Invalid JSON string in request.`;
    }
    if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
    }
    if (!res.headersSent) {
        res.status(err.httpStatusCode).json({ error: { message: err.message } });
    }

    if (err.message === "Topology was destroyed") {
        console.log(`Mongodb Error: Topology was destroyed. Trying to Reconnect`);
        reconnectDb();
    }

    logger.fatal(
        {
            errorMsg: err.message,
            uri: req.url,
            body: req.body,
            params: req.params,
            headers: req.headers,
            stack: err.stack,
        },
        `${err.httpStatusCode}Error`
    );
    res.status(err.httpStatusCode).end(err.message);
};

const morganReqHandler = morgan((tokens, req, res) => {
    logger.info({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        res: tokens.res(req, res, "content-length"),
        responseTime: tokens["response-time"](req, res),
        remoteAddress: tokens["remote-addr"](req, res),
        userAgent: tokens["user-agent"](req, res),
    });
    return "";
});


/** Client server config */
const clientServer = new InversifyExpressServer(clientContainer, undefined, {
    rootPath: "/client",
});
clientServer.setConfig((expressApp) => {
    expressApp.use(helmet());
    expressApp.use(cors());
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(morganReqHandler);
    expressApp.use(express.static(__dirname + "/uploads/driver_license"));
    expressApp.use(express.static(__dirname + "/uploads/insurance_card"));

    var apps = express();
    apps.use(
        fileUpload({
            useTempFiles: true,
        })
    );
});

/** Admin server */
const adminServer = new InversifyExpressServer(
    adminContainer,
    undefined,
    {
        rootPath: "/admin",
    },
    clientServer.build()
);

adminServer.setConfig((expressApp) => {
    expressApp.use(helmet());
    expressApp.use(cors());
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(morganReqHandler);
    expressApp.use(express.static(__dirname + "/uploads"));
    expressApp.use(fileUpload({
        useTempFiles: true,
    })
    );

});

adminServer.setErrorConfig((eApp) => {
    eApp.use((req, res, next) => {
        res.sendStatus(404);
    });
    eApp.use(errorHandler);
});

export const app = adminServer.build();
