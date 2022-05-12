//const router = require("express").Router();
let Asset = require("../../models/AssetsManagementModule/AssetsModel");
let Asset_Lending = require("../../models/AssetsManagementModule/AssetsLender");
let Employee = require("../../models/ReportersManagementModule/EmployeeModel");

//view all assets
exports.viewAssets = async (req,res)=>{
    await Asset.find().then((assets)=>{
        res.json(assets)
    }).catch((err)=>{
        console.log(err)
    })
}
//create assets
exports.createAsset = async (req,res) => {
    const {assetID,assetCategory,model,serialNumber,status} = req.body;  //destructured method
    
    const newAsset = new Asset({
        assetID,assetCategory,model,serialNumber,status
    })
    const duplicateAssetID = await Asset.findOne({ assetID });
    if(duplicateAssetID)
        return res.status(200).json({ message: "Asset ID already exists",success:false });
    
    await newAsset.save().then(()=>{
        res.status(200).json({message: "Asset has successfully added!",success:true})
    }).catch((err)=>{
        res.status(500).json({ message: "Asset has not inserted!",error:err.message, success:"false1" });
    })
}


//assign asset
exports.assignAsset = async(req,res) => {
    const ID = req.params.id;
    const assignDate =  new Date();
    
    const employeeID = req.body.empID;
    
    const asset = await Asset.findOne({"_id" : ID},{"_id":false,"assetID":true,"status":true})
    const assetID = asset.assetID
    const status = asset.status

    if(status == 'Available')
    {
        const assignAsset = await Asset.updateOne(
            {_id : ID},
            {
                $set:{status:"Non-Available"}
            }
        )
        const insertLending = new Asset_Lending({
            assignDate,assetID,employeeID
        })
    
        insertLending.save()
        .then(()=>{
                res.status(200).send({message:"Asset assigned!",success:true})
            }).catch((err)=>{
                   console.log(err);
                res.status(500).send({message:"Asset is not assigned!",error:err.message,success:false})
        })
    }else{
        res.status(400).send({message:"Cannot assigned!",success:false})
    }
    

}

//find assets by category
exports.assetsByCategory = async(req,res) => {
    const CATEGORY = req.params.assetCategory;
    const asset = await Asset.find({"assetCategory" :{$regex: new RegExp([CATEGORY?.toLowerCase()], "i") }})
    .then((assets)=>{
        res.json({data:assets,success:true})
        //res.status(400).json(assets)
    }).catch((err)=>{
            //console.log(err);
            res.status(500).send({message:"No assets like that category!",error:err.message,success:false})
    })
    
}

//unassign asset
exports.unassignAsset = async(req,res) => {
    let ID = req.params.id;
    var empID;
    var employeeList;
    const date = new Date();
    
    const asset = await Asset.findOne({"_id" : ID},{"_id":false,"assetID":true,"status":true})
    if(asset.status == "Non-Available")
    {
        employeeList =  await Asset_Lending.findOne({"assetID":asset.assetID},{"employeeID":1}).sort({_id:-1})
        empID = employeeList.employeeID   
    }

    const unassignAsset = await Asset.updateOne(
        {_id : ID},
        {
            $set:{status:"Available"}
        }
    )
    const docID = await Asset_Lending.findOne({"employeeID" : empID , "assetID" : asset.assetID},{"_id":true}).sort({_id:-1})

    const unassignEmp = await Asset_Lending.updateMany(
        {_id : docID._id},
        {
            $set:{reassignDate : date}
        }
    )
    .then(()=>{
            res.status(200).send({status:"Asset unassigned!",success:true})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Asset is not unassigned!",error:err.message, success:false})
    })

}

//create fault for asset
exports.createFault = async(req,res) => {
    let ID = req.params.id;
    
    const faultAsset = await Asset.updateOne(
        {_id : ID},
        {
            $set:{status:"Fault"}
        }
    ).then(()=>{
            res.status(200).send({status:"Create a fault!", success:true})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Not create a fault!",error:err.message, success:false})
    })

}

//release fault for asset
exports.releaseFault = async(req,res) => {
    let ID = req.params.id;
    
    const faultAsset = await Asset.updateOne(
        {_id : ID},
        {
            $set:{status:"Available"}
        }
    ).then(()=>{
            res.status(200).send({status:"Release a fault!",success:true})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Not release a fault!",error:err.message,success:false})
    })

}

//get available assets
exports.availableAssets = async (req,res)=>{
    Asset.find({status:'Available'}).then((assets)=>{
        res.json(assets)
    }).catch((err)=>{
        //console.log(err)
        res.status(500).send({error:err.message})
    })
}

//get unavailable assets
exports.unavailableAssets = async (req,res)=>{
    Asset.find({status:'Non-Available'}).then((assets)=>{
        res.json(assets)
    }).catch((err)=>{
        res.status(500).send({error:err.message})
    })
}

//get details of specific asset
exports.detailsOfAsset = async(req,res)=>{
    let ID = req.params.id;
    await Asset.findOne({_id:ID}).then((assets)=>{  
        res.json(assets)
    }).catch((err)=>{
        res.status(500).send({error:err.message})
    })
}


//find who has assigned  for an asset at current time
exports.assignPerson = async(req,res)=>{
    let ID = req.params.id;
    var asset = await Asset.findOne({"_id" : ID},{"_id":false,"assetID":true,"status":true})
    
    if(asset.status == "Non-Available")
    {
        const employeeList =  await Asset_Lending.findOne({"assetID":asset.assetID},{"employeeID":1}).sort({_id:-1})
        const emp = employeeList.employeeID
        try{
            res.status(200).send({empID:emp})
        }
        catch(err){
            res.status(500).send({message:err.message})
        }
    }else if(asset.status == "Fault")
    {
        res.status(200).send({message:"Asset has a fault"})
    }
    else{
        res.status(200).send({message:"Asset is currently Available"})
    }
      
}

//find whether an employee has assigned for an asset current time or give it back for changing employee status to resign
exports.isAssigned = async(req,res)=>{
    let empID = req.body.empID;
    if(empID)
    {
        const lenderAsset =  await Asset_Lending.findOne({"employeeID":empID,"reassignDate":null},{"employeeID":1,"assetID":1}).sort({_id:-1})
        if(lenderAsset)
        {
            res.status(200).send({assetID:lenderAsset.assetID,message:"You cannot change the status to resign"})
        }else
        {
            //res.status(200).send({assetID:"Nothing has assigned!",message:"You can change the status to resign"})
            const updateEmpStatus = await Employee.updateOne(
                {employeeID : empID},
                {
                    $set:{status:"Resign"}
                }
            ).then(()=>{
                    res.status(200).send({message:"Change the employee status to the resign!"})
            }).catch((err)=>{
                    res.status(500).send({message:"Cannot change the status!",error:err.message})
            })
        }
    }else{
        res.status(500).send({message:"Please fill the Employee ID"})
    }
    

}

exports.updateAsset = async(req,res) =>{
    let { id } = req.params;
    const { assetCategory, model, serialNumber, status } = req.body;
    const updateAsset = { 
        assetCategory, 
        model, 
        serialNumber, 
        status 
    }
    const update = await Asset.findByIdAndUpdate(id, updateAsset)
    .then(()=>{
        res.status(200).send({message:"Updated successfully",success:true})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({message:"Updated Incomplete", success:false,err:err.message})
    })
}


