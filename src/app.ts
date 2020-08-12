import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { websiteMonitor, MonitorRes } from "./websiteMonitor";
import { Websites } from "./watchConfig";
import Influx, { InfluxDB } from "influx";
import os from "os";

const app: Application = express();
app.use(bodyParser());
app.use(express.json());
// my data base
const influx = new Influx.InfluxDB({
  host: "localhost",
  database: "watchman",
  schema: [
    {
      measurement: "website_watch",
      fields: {
        resTime: Influx.FieldType.INTEGER,
        dns: Influx.FieldType.INTEGER,
        tcp: Influx.FieldType.INTEGER,
        tls: Influx.FieldType.INTEGER,
      },
      tags: ["host"],
    },
  ],
});

// Run websiteMonitor after interval of Time
Websites.map((w) =>
  setInterval(websiteMonitor, w.interval * 1000, w, (res: MonitorRes) => {
    let resTime = res.response - res.start;
    influx
      .writePoints([
        {
          timestamp: res.start,
          measurement: "website_watch",
          tags: { host: w.name },
          fields: {
            resTime: resTime,
            dns: res.phases.dns,
            tls: res.phases.tls,
            tcp: res.phases.tcp,
          },
        },
      ])
      .then(() => {
        return influx.query(`
        select * from website_watch
        where host = ${Influx.escape.stringLit(w.name)}
        order by time desc
        limit 3
      `);
      })
      .then((rows) => {
        rows.forEach((row) => console.log(`A request to ${JSON.stringify(row)} `));
      })
      .catch((err) => {
        console.error(`Error saving data to InfluxDB! ${err}`);
      });
    // console.log(res);
  })
);

influx.getDatabaseNames().then((name) => console.log(name));

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

const PORT: number = 40;
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT} >> http://localhost:${PORT}`);
});
