import got from "got";
import { IWebsite } from "./watchConfig";
interface IPhases {
  wait: number;
  dns: number;
  tcp: number;
  tls: number;
  request: number;
  firstByte: number;
  download: number;
  total: number;
}

export interface MonitorRes {
  start: number;
  socket: number;
  lookup: number;
  connect: number;
  secureConnect: number;
  upload: number;
  response: number;
  end: number;
  error: string | undefined;
  abort: string | undefined;
  phases: IPhases;
}

export const websiteMonitor = async (w: IWebsite, onSuccess: (res) => void) => {
  try {
    const response = await got(w.url);
    onSuccess(response.timings);
  } catch (err) {
    console.log(err);
  }
};
