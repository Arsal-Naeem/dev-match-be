import express from "express";
import {
  predictCareer,
  getCareers,
  createCareer,
} from "../controllers/careerController.js";

const router = express.Router();

router.post("/predict", predictCareer);
router.get("/", getCareers);
router.post("/", createCareer);

export default router;
