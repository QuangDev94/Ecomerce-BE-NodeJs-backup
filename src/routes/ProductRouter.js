const express = require("express");
const productController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleWare, productController.createProduct);
router.put("/update/:id", authMiddleWare, productController.updateProduct);
router.get("/get-details/:id", productController.getProduct);
router.get("/get-all", productController.getAll);
router.get("/get-all-type", productController.getAllType);
router.delete("/delete/:id", authMiddleWare, productController.deleteProduct);
router.post("/delete-many", authMiddleWare, productController.deleteMany);

module.exports = router;
