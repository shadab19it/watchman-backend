import express, { Request, Response } from "express";
const router = express.Router();
import { influx } from "../app";

router.get("/moniter", async (req: Request, res: Response) => {
  influx
    .query(
      ` select * from response_times
           order by time desc
     `
    )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err.stack });
    });
});

export default router;
