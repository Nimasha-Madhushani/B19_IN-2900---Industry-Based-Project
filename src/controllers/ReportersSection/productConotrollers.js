const mongoose = require("mongoose");
const teamSchema = require("../../models/ReportersManagementModule/TeamModel");
const employeeSchema = require("../../models/ReportersManagementModule/EmployeeModel");
const productSchema = require("../../models/ReportersManagementModule/ProductModel");
const {
  findOne,
} = require("../../models/ReportersManagementModule/EmployeeModel");


//---------------add product----------------
exports.addProduct = async (req, res) => {
    const productID = req.body.productID;
    const productName = req.body.productName;
    const description = req.body.description;
    const recievedDate = new Date();
    //const launchDate=req.body.launchDate;
    const teamID = req.body.teamID;
  
    newProduct = new productSchema({
      productID,
      productName,
      description,
      recievedDate,
      // launchDate,
      teamID,
    });
  
    const existingTeam = await teamSchema.findOne({ teamID });
    if (existingTeam) {
      await newProduct
        .save()
        .then(() => {
          res.json("product is added successfully!");
        })
        .catch((err) => {
          res.status(400).json({ message: "product is not added!" });
        });
    } else {
      res.status(500).send({ message: "Cannot add product!" });
    }
  };
  //--------------------------------------------------
  
  //-----------update product------------------------
  
  exports.updateProduct = async (req, res) => {
  
    const { id } = req.params;
  
    const productID = req.body.productID;
    const productName = req.body.productName;
    const description = req.body.description;
    //const recievedDate=new Date();
    //const launchDate=req.body.launchDate;
    const teamID = req.body.teamID;
  
    newProductUpdate = {
      productID,
      productName,
      description,
       //recievedDate:id,
      // launchDate,
      teamID,
    };
  
  
    const existingProduct = await productSchema.findById(id);
    if (existingProduct) {
     
      await productSchema
        .findByIdAndUpdate(existingProduct._id, newProductUpdate, { new: true })
        .then(() => {
          res.json("product is updated successfully!");
        })
        .catch((err) => {
          res.status(400).json({ message: "product is not updated!" });
        });
    }
  };
  //-----------------------------------------------