//const router = require("express").Router();
let Asset = require("../../models/AssetsManagementModule/AssetsModel");
let Asset_Lending = require("../../models/AssetsManagementModule/AssetsLender");


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
        return res.status(400).json({ message: "Asset ID already exists" });
    
    await newAsset.save().then(()=>{
        res.json("Asset has successfully added!")
    }).catch((err)=>{
        res.status(500).json({ message: "Asset has not inserted!" });
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
                res.status(200).send({message:"Asset assigned!"})
            }).catch((err)=>{
                   console.log(err);
                res.status(500).send({message:"Asset is not assigned!",error:err.message})
        })
    }else{
        res.status(400).send({message:"Cannot assigned!"})
    }
    

}

//find assets by category
exports.assetsByCategory = async(req,res) => {
    const CATEGORY = req.body.assetCategory;
    
    const asset = await Asset.find({"assetCategory" :{$regex: new RegExp([CATEGORY?.toLowerCase()], "i") }})
    .then((assets)=>{
        res.json(assets)
    }).catch((err)=>{
            console.log(err);
            res.status(500).send({message:"No assets like that category!",error:err.message})
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
            res.status(200).send({status:"Asset unassigned!"})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Asset is not unassigned!",error:err.message})
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
            res.status(200).send({status:"Create a fault!"})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Not create a fault!",error:err.message})
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
            res.status(200).send({status:"Release a fault!"})
        }).catch((err)=>{
               console.log(err);
            res.status(500).send({status:"Not release a fault!",error:err.message})
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
    }else{
        res.status(200).send({message:"Asset is currently Available"})
    }
      
}

//find whether an employee has assigned for an asset current time or give it back
exports.isAssigned = async(req,res)=>{
    let empID = req.body.empID;
    
    const lenderAsset =  await Asset_Lending.findOne({"employeeID":empID,"reassignDate":null},{"employeeID":1,"assetID":1}).sort({_id:-1})
    if(lenderAsset)
    {
        res.status(200).send({assetID:lenderAsset.assetID})
    }else
    {
        res.status(200).send({assetID:"Nothing has assigned!"})
    }

}


