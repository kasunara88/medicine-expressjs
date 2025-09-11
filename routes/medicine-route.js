const express = require("express");

const {
  saveMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getMedicineById,
} = require("../controller/medicine-controller");

const router = express.Router();

router.post("/", saveMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.get("/", getAllMedicine);
router.get("/:id", getMedicineById);

module.exports = router;
