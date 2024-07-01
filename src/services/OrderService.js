const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;

    try {
      const promise = orderItems.map(async (item) => {
        const productChecking = await Product.findOne({
          _id: item?.product,
          quality: { $gte: item?.amount },
        });
        if (productChecking) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERROR",
            data: item?.name,
          };
        }
      });
      const result = await Promise.all(promise);
      const filterResult = result.filter((i) => {
        return i.message === "ERROR";
      });
      const newFilterResult = filterResult.map((i) => i.data);
      if (filterResult.length > 0) {
        reject({
          status: "OK",
          message: `Products ${newFilterResult.join(",")} Out Of Stock`,
        });
      } else {
        const updatePromise = orderItems.map(async (item) => {
          const productChecking = await Product.findOneAndUpdate(
            {
              _id: item?.product,
            },
            {
              $inc: {
                quality: -item?.amount,
                solded: +item?.amount,
              },
            },
            {
              new: true,
            },
          );
        });
        const createOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          isPaid,
          paidAt,
        });
        if (createOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createOrder,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getMyOrderAll = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({
        user: id,
      });
      if (orders === null) {
        resolve({
          status: "ERROR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: orders,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getMyOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });
      if (order === null) {
        resolve({
          status: "ERROR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const cancelOrder = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promise = data?.orderItems?.map(async (item) => {
        const productUpdate = await Product.findOneAndUpdate(
          {
            _id: item?.product,
          },
          {
            $inc: {
              quality: +item?.amount,
              solded: -item?.amount,
            },
          },
          {
            new: true,
          },
        );
        if (productUpdate) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERROR",
            data: item?.product,
          };
        }
      });
      const result = await Promise.all(promise);
      const checkResult = result.every((i) => {
        return i.message === "SUCCESS";
      });
      if (checkResult) {
        const order = await Order.findById({
          _id: data.orderId,
        });
        if (order === null) {
          resolve({
            status: "ERROR",
            message: "The order is not defined",
          });
        } else {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: order,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getOrderAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().populate("user");
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createOrder,
  getMyOrderAll,
  getMyOrderDetails,
  cancelOrder,
  getOrderAll,
};
