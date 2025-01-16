const {
  masterProduct,
  subProductCategory,
  masterProductCategory,
} = require("../models");

const getAllProducts = async (req, res) => {
  try {
    const allProductsData = await masterProduct.findAll({
      include: [
        {
          model: subProductCategory,
        },
      ],
    });
    console.log("allProductsData", allProductsData);

    res.jsonSuccess(
      200,
      {
        indonesian: "Data produk berhasil diambil",
        english: "Products data fetched successfully",
      },
      allProductsData
    );
  } catch (error) {
    console.log("error", error);
    res.jsonFailed(error?.statusCode, error?.code, error?.message);
  }
};

module.exports = {
  getAllProducts,
};
