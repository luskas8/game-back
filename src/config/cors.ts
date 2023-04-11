import { Request, Response, NextFunction } from "express"

export function corsConfig(req: Request, res: Response, next: NextFunction): void {
  res.header("Access-Control-Allow-Origin", "*")

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
};
