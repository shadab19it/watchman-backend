import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { mysqlDB } from "../app";

// Adde a websigte Info
export const Addwebsite = async (req: Request, res: Response) => {
  const { name, url, timeInterval } = req.body;

  let websiteInfo = { name, url, timeInterval };
  let sql = "INSERT INTO websiteinfo SET ?";

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }

  mysqlDB.query(sql, websiteInfo, (err, result) => {
    if (err) {
      return res.status(400).json({ errors: "Website Info not save in db" });
    }
    console.log(result);
    return res.status(200).json({ msg: "Website Info save in db" });
  });
};

// get all websigte Info
export const getAllWebsite = async (req: Request, res: Response) => {
  let sql = "SELECT * FROM websiteinfo";
  mysqlDB.query(sql, (err, results) => {
    if (err) {
      return res.status(400).json({ errors: "Website Info not found in db" });
    }
    console.log(results);
    return res.json({ results });
  });
};
// get website by ID name
export const getWebsiteById = async (req: Request, res: Response) => {
  let sql = `SELECT * FROM websiteinfo WHERE id = ${req.params.id}`;
  mysqlDB.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    return res.json({ results });
  });
};

// Update website Info by Id
export const getUdateById = async (req: Request, res: Response) => {
  const { name, url, timeInterval } = req.body;
  let newInfo = `UPDATE websiteinfo SET ? WHERE id = ${req.params.id}`;
  mysqlDB.query(newInfo, { name, url, timeInterval }, (err, results) => {
    if (err) throw err;
    console.log(results);
    return res.json({ results, msg: "Update Successfull" });
  });
};

// Detele website Info by Id
export const getDelete = async (req: Request, res: Response) => {
  let sql = `DELETE FROM websiteinfo WHERE id = ${req.params.id}`;
  mysqlDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    return res.json({ msg: "website deleted... successful" });
  });
};
