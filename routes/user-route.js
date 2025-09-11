const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../controller/user-controller");
const { authGuard } = require("../controller/utill/auth-guard");
const router = express.Router();

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save inside /uploads
  },
  // Rename the file to avoid name conflicts
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // .jpg, .png, .pdf
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-"); // optional: replace spaces
    cb(null, `${base}-${Date.now()}${ext}`); // eg: photo-16932232323.png
  },
});

// 🔹 Init Multer (no filter)
const upload = multer({ storage });

router.post(
  "/register",
  upload.single("image"),
  userController.userRegistration
);
router.post("/login", userController.userLogin);
router.get("/profile", authGuard, userController.getUserProfile);
module.exports = router;
