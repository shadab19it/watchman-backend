import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import { websiteMonitor, MonitorRes } from "./websiteMonitor";
import { Websites } from "./watchConfig";
import Influx, { InfluxDB } from "influx";
import mysql from "mysql";
const app: Application = express();
// my Routes
import website from "./routes/website";
import monitor from "./routes/monitor";

// middlewere
app.use(bodyParser());
app.use(express.json());
// my mysql database
export const mysqlDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kightangle123",
  insecureAuth: true,
  database: "watchman",
});

mysqlDB.connect((err) => {
  if (err) throw err;
  console.log("mysql db Connected!");
  // mysqlDB.query("CREATE DATABASE IF NOT EXISTS watchman", (err, result) => {
  //   if (err) throw err;
  //   console.log("maysql Database created");
  // });
});

//my Influx database
export const influx = new Influx.InfluxDB({
  host: "localhost",
  database: "watchman",
  schema: [
    {
      measurement: "response_times",
      fields: {
        resTime: Influx.FieldType.INTEGER,
        dns: Influx.FieldType.INTEGER,
        tcp: Influx.FieldType.INTEGER,
        tls: Influx.FieldType.INTEGER,
        download: Influx.FieldType.INTEGER,
        tffb: Influx.FieldType.INTEGER,
        timeNow: Influx.FieldType.INTEGER,
      },
      tags: ["host"],
    },
  ],
});

//Run websiteMonitor after interval of Time
Websites.map((w) =>
  setInterval(websiteMonitor, w.interval * 1000, w, (res: MonitorRes) => {
    let resTime = res.response - res.start;
    influx
      .writePoints([
        {
          timestamp: new Date(),
          measurement: "response_times",
          tags: { host: w.name },
          fields: {
            timeNow: res.start,
            resTime: resTime,
            dns: res.phases.dns,
            tls: res.phases.tls,
            tcp: res.phases.tcp,
            tffb: res.phases.firstByte,
            download: res.phases.download,
          },
        },
      ])
      .catch((err) => {
        console.error(`Error saving data to InfluxDB! ${err}`);
      });
    // console.log(res);
  })
);

influx
  .getDatabaseNames()
  .then((names) => {
    if (!names.includes("watchman")) {
      return influx.createDatabase("watchman");
    } else {
      console.log("Database Exists");
    }
  })
  .catch((err) => {
    console.error(`Error creating Influx database!`);
  });

// my routes
app.use("/api/website", website);
app.use("/api", monitor);

const PORT: number = 40;
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT} >> http://localhost:${PORT}`);
});
