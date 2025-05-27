const router = require("express").Router();
const PromotionController = require("../controllers/promotions.controllers");

router.get("/", PromotionController.getAllPromotions);
router.post("/", PromotionController.createPromotion);
router.put("/", PromotionController.updatePromotion);
router.delete("/", PromotionController.deletePromotion);

module.exports = router;
