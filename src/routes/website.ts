import express from "express";
import { Addwebsite, getAllWebsite, getWebsiteById, getUdateById, getDelete } from "../controlers/website";
import { check } from "express-validator";
const router = express.Router();

// added website
router.post(
  "/add",
  [
    check("url", "Url is not valid").isURL(),
    check("name", "Name must be at least 5 chars long").isLength({ min: 5 }),
    check("timeInterval", "Enter number value").isNumeric(),
  ],
  Addwebsite
);
// get all website
router.get("/getall", getAllWebsite);
// get website by Id
router.get("/get/:id", getWebsiteById);
// get updata by id
router.put("/update/:id", getUdateById);
// Delete website
router.delete("/delete/:id", getDelete);

// get website by userId's website's id
// router.get("/website/get/:userId/:id", getWebsiteUserId);
export default router;
