import "dotenv/config";
import cors from "cors";
import { mongoConnect } from "./database";
import { Router } from "./routes";
import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "./zod-translation.json";
import { errorHandler } from "./errorHandler";

i18next.init({
  lng: "br",
  resources: {
    br: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

mongoConnect();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const allowedOrigins = ["http://localhost:3000", "http://192.168.0.111:3333"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(Router);
app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
