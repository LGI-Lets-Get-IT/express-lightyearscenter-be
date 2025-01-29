const OrderService = require("../services/orders.services");
const { throwError } = require("../utils/messageHandler.utils");

const getAllOrders = async (req, res) => {
  try {
    const allOrderData = await OrderService.fetchAllOrders();

    res.jsonSuccess(
      200,
      {
        indonesian: "Data pesanan berhasil diambil",
        english: "Order data fetched successfully",
      },
      allOrderData
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const { order_number } = req.body;
    const createdOrder = await OrderService.create(req.body);

    res.jsonSuccess(
      201,
      {
        indonesian: "Order berhasil dibuat",
        english: "Order created successfully",
      },
      createdOrder
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  //   updateOrder,
  //   deleteOrder,
};
