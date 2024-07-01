const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, name } = newUser;
    try {
      // Check an email exits in database?
      const checkuser = await User.findOne({
        email: email,
      });
      if (checkuser !== null) {
        resolve({
          status: "ERROR",
          message: "The email is already",
        });
      }
      // encode password
      const hash = bcrypt.hashSync(password, 10);
      // Create a valid user
      const createdUser = await User.create({
        name,
        email,
        phone:
          newUser?.phone || Number(Math.floor(Math.random() * 10000000000)),
        address: newUser?.address,
        password: hash,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      // Check an email exits in database?
      const checkuser = await User.findOne({
        email: email,
      });
      if (checkuser === null) {
        resolve({
          status: "ERROR",
          message: "The email is not defined",
        });
      }

      // Check password
      const comparePassword = bcrypt.compareSync(password, checkuser.password);
      if (comparePassword) {
        const access_token = await generalAccessToken({
          id: checkuser.id,
          isAdmin: checkuser.isAdmin,
        });
        const refresh_token = await generalRefreshToken({
          id: checkuser.id,
          isAdmin: checkuser.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Success",
          access_token,
          refresh_token,
        });
      } else {
        resolve({
          status: "ERROR",
          message: "The password is wrong",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check an user exits in database?
      const checkuser = await User.findOne({
        _id: id,
      });
      if (checkuser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      if (updatedUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: updatedUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check an user exits in database?
      const checkuser = await User.findOne({
        _id: id,
      });
      if (checkuser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const deletedUser = await User.findByIdAndDelete(id);

      if (deletedUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: deletedUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "OK",
          message: "The user is not definded",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: user,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getDetailsUser,
  getAllUser,
};
