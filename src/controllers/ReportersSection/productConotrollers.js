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
  //const recievedDate = new Date();

  //const teamName=req.body.teamName;
  const findTeam = await teamSchema.findOne({ teamName: teamNames });
  console.log(findTeam._id);
  console.log(findTeam);
  const newProduct = new productSchema({
    productID,
    productName,
    description,
    teamID: findTeam._id, //frontend
  });

  //product eka id duplicateda
  const existingProduct = await productSchema.findOne({ productID: productID });

  //dan danna yana id eka denata product ekkakt dalada
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

//--------------------------------------------------

//-----------update product------------------------

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  const { productID, productName, description } = req.body;

  //const recievedDate=new Date();
  //const teamID = req.body.teamID;

  const newProductUpdate = {
    productID,
    productName,
    description,
    //recievedDate:id,
    //teamID,
  };

  const existingProduct = await productSchema.findOne({ productID: productID });
  if (existingProduct) {
    await productSchema
      .findByIdAndUpdate(existingProduct._id, newProductUpdate, { new: true })
      .then(() => {
        res.json("product is updated successfully!");
      })
      .catch((err) => {
        res.status(400).json({ message: "product is not updated!", err: err });
      });
  }
};
//---------------------------------------------------------
