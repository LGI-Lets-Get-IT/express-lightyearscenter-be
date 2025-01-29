// const Promotionservice = require('../services/Promotions.services')

const getAllPromotions = async (req, res) => {
  try {
    // const allPromotionsData = await Promotionservice.fetchAllOrders()
    // console.log("allPromotionsData", allPromotionsData);

    res.jsonSuccess(
      200,
      {
        indonesian: "Data diskon berhasil diambil",
        english: "Promotions data fetched successfully",
      },
      // allPromotionsData
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const createPromotion = async (req, res) => {
  try {
    
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}
const updatePromotion = async (req, res) => {
  try {
    
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const deletePromotion = async (req, res) => {
  try {
    
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

module.exports = {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
