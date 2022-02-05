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
  console.log(findTeam._id);
  console.log(findTeam);
  const newProduct = new productSchema({
    productID,
    productName,
    description,
    teamID: findTeam._id, //frontend
  });

  const existingProduct = await productSchema.findOne({ productID: productID });

  const teamProduct = await productSchema.findOne({ teamID: findTeam._id });

  if (!existingProduct && !teamProduct) {
    const savedProduct = await newProduct
      .save()
      .then(() => {
        res.json("product is added successfully!");
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "product is not added !", err: err.message });
      });
  } else {
    res
      .status(500)
      .send({ message: "product is existing or team has a prouct" });
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
    //teamID,
  };

  try {
    const existingProduct = await productSchema.findById(id);
    const filterProducts = await productSchema.find({ _id: { $ne: id } }); //except the product which is going to update

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

      return res.status(200).json("product is updated successfully!");
    } else {
      return res.status(400).json("product is not updated!");
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Cannot Update product", err: err.message });
  }
};

//---------------view all products-------------------------

exports.viewProducts = async (req, res) => {
  await productSchema
    .find()
    .then((product) => {
      res.json({ state: true, data: product });
    })
    .catch((err) => {
      res.json({ state: false, err: err });
    });
};
