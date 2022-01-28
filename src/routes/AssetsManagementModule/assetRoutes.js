const router = require("express").Router();
const { viewAssets, assignAsset, createAsset, unassignAsset, createFault, availableAssets, unavailableAssets, detailsOfAsset, assignPerson, releaseFault, assetsByCategory } = require("../../controllers/assetSection/assetControllers");
//create assets
router.post('/add',createAsset)

//view all assets
router.get('/',viewAssets)

//assign asset
router.patch("/assign/:id",assignAsset)

//unassign asset
router.patch("/unassign/:id",unassignAsset)

//create fault for asset
router.patch("/fault/:id",createFault)

//release fault for asset
router.patch("/releaseFault/:id",releaseFault)

//get available assets
router.get("/available",availableAssets)

//get unavailable assets
router.get("/unavailable",unavailableAssets)

//get details of specific asset
router.get("/detail/:id",detailsOfAsset)


//find who has assigned  for an asset at current time
router.get("/assignPerson/:id",assignPerson)

//find assets by category wise
router.get("/category",assetsByCategory)


module.exports = router;