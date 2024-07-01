const Product = require("../models/ProductModel");

const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        name: data.name,
      });

      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The Product is already",
        });
      } else {
        const createdProduct = await Product.create({
          ...data,
          quality: Number(data.countInStock),
        });
        if (createdProduct) {
          resolve({
            status: "OK",
            message: "Success",
            data: createdProduct,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: productId,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERROR",
          message: "The product is not defined",
        });
      } else {
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          data,
          { new: true },
        );
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updatedProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: productId,
      });
      if (product === null) {
        resolve({
          status: "ERROR",
          message: "The product is not definded",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: product,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAll = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allProductFilter = await Product.find({
          [label]: { $regex: filter[1] },
        });
        const prodctFilterAfterLimit = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: prodctFilterAfterLimit,
          total: allProductFilter?.length,
          pageCurrent: Number(page) + 1,
          totalPage: Math.ceil(allProductFilter?.length / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page) + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: productId,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERROR",
          message: "The product is not definded",
        });
      } else {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        resolve({
          status: "OK",
          message: "SUCCESS",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMany = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedMany = await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  getAll,
  getAllType,
  deleteProduct,
  deleteMany,
};
