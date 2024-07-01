const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, rating, countInStock, description } =
      req.body;
    if (!name || !image || !type || !price || !rating || !countInStock) {
      return res.status(200).json({
        status: "ERROR",
        message: "The input is required!",
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERROR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.updateProduct(productId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERROR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAll(
      limit || 4,
      page || 0,
      sort,
      filter,
    );
    return res.status(200).json({ response });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERROR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERROR",
        message: "The Ids is required",
      });
    }
    const response = await ProductService.deleteMany(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  getAll,
  deleteProduct,
  deleteMany,
  getAllType,
};
