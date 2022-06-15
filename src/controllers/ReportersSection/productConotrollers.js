const mongoose = require("mongoose");

const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const productSchema = require("../../models/ReportersManagementModule/ProductModel");
const {
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");

//---------------add product----------------
exports.addProduct = async (req, res) => {
  const { productID, productName, description, teamNames } = req.body;

  const findTeam = await teamSchema.findOne({ teamName: teamNames });
  if (!findTeam) {
    return res
      .status(400)
      .json("team is not existing, product cannot be created");
  }

  const newProduct = new productSchema({
    productID,
    productName,
    description,
    teamID: findTeam._id,
  });

  const existingProduct = await productSchema.findOne({ productID: productID });

  const existingProductName = await productSchema.findOne({
    productName: productName,
  });
  if (existingProduct || existingProductName) {
    return res.status(400).json({
      status: "productID or productName is existing, cannot be added!",
      success: false,
    });
  }

  if (!existingProduct && !existingProductName) {
    const savedProduct = await newProduct
      .save()
      .then(() => {
        return res.status(200).json({
          status: "product is added successfully!",
          success: true,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({
            status: "product is not added !",
            err: err.message,
            success: "false1",
          });
      });
  }
};

//-----------update product------------------------

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  const { productID, productName, description } = req.body;

  const newProductUpdate = {
    productID,
    productName,
    description,
  };

  try {
    const existingProduct = await productSchema.findOne({ _id: id });
    const filterProducts = await productSchema.find({
      _id: { $ne: id },
    }); //except the product which is going to update

    let chekFalg = false;
    await Promise.all(
      filterProducts.map(async (filterproduct) => {
        if (
          filterproduct.productID == productID ||
          filterproduct.productName == productName
        ) {
          chekFalg = true;
        }
      })
    );

    if (existingProduct && !chekFalg) {
      await productSchema.findByIdAndUpdate(
        existingProduct._id,
        newProductUpdate,
        { new: true }
      );

      return res
        .status(200)
        .json({ status: "product is updated successfully!", success: true });
    } else {
      return res
        .status(200)
        .json({ status: "product is not updated!", success: false });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Cannot Update product", err: err.message });
  }
};

//---------------view all products-------------------------

exports.viewProducts = async (req, res) => {
  try {
    const products = await productSchema.find();

    let allProduct = [];
    await Promise.all(
      products.map(async (product) => {
        const { _id, productID, productName, description, teamID } = product;
        const team = await teamSchema.findOne({ _id: teamID });

        allProduct.push({
          _id,
          productID,
          productName,
          description,
          teamID,
          teamName: team.teamName,
        });
      })
    );

    res.json({ state: true, data: allProduct });
  } catch (err) {
    res.json({ state: false, err: err.message });
  }
};
