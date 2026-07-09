import express, { type Express, type Request, type Response } from "express";
import config from "./config";
import app from "./app";

const port = config.port;

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();