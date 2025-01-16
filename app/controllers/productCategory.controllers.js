const { masterProductCategory } = require("../models");

const getAllCategories = async (req, res) => {
  try {
    const allCategoiesData = await masterProductCategory.findAll({
      order: [["id", "ASC"]],
      // include: [{ model: subProductCategory }],
    });

    res.jsonSuccess(
      200,
      {
        indonesian: "Data kategori produk berhasil diambil",
        english: "Product categories data fetched successfully",
      },
      allCategoiesData
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.code, error?.message);
  }
};

module.exports = {
  getAllCategories,
};
