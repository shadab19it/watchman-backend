export interface IWebsite {
  name: string;
  url: string;
  interval: number;
}

export const Websites: Array<IWebsite> = [
  {
    name: "gigahex",
    url: "https://www.gigahex.com/",
    interval: 10,
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/",
    interval: 8,
  },
  {
    name: "linkdin",
    url: "https://www.linkedin.com/",
    interval: 15,
  },
  {
    name: "stackoverflow",
    url: "https://stackoverflow.com/",
    interval: 18,
  },
];
