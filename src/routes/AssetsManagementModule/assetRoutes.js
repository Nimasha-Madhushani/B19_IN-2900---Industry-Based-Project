const router = require("express").Router();
const {
  viewAssets,
  assignAsset,
  createAsset,
  unassignAsset,
  createFault,
  availableAssets,
  unavailableAssets,
  detailsOfAsset,
  assignPerson,
  releaseFault,
  assetsByCategory,
  isAssigned,
  updateAsset,
  availableAssetsCategory
} = require("../../controllers/assetSection/assetControllers");
const userRoles = require("../../Config/UserRoles");
const verify = require("../../middleware/VerifyJWT");
const verifyRoles = require("../../middleware/verifyUserRole");
//create assets
router.post("/add",verifyRoles([userRoles.IT]), createAsset);

//view all assets
router.get("/",verifyRoles([userRoles.IT,userRoles.HR]), viewAssets);

//assign asset
router.patch("/assign/:id",verifyRoles([userRoles.IT]), assignAsset);

//unassign asset
router.patch("/unassign/:id",verifyRoles([userRoles.IT]), unassignAsset);

//create fault for asset
router.patch("/fault/:id",verifyRoles([userRoles.IT]), createFault);

//release fault for asset
router.patch("/releaseFault/:id",verifyRoles([userRoles.IT]), releaseFault);

//get available assets
router.get("/available", availableAssets);

//get unavailable assets
router.get("/unavailable",verifyRoles([userRoles.IT,userRoles.HR]), unavailableAssets);

//get details of specific asset
router.get("/detail/:id",verifyRoles([userRoles.IT]), detailsOfAsset);

//find who has assigned  for an asset at current time
router.get("/assignPerson/:id",verifyRoles([userRoles.IT]), assignPerson);

//find assets by category wise
router.get("/category/:assetCategory",verifyRoles([userRoles.IT,userRoles.HR]), assetsByCategory);

//find whether an employee has assigned for an asset current time or given it back
router.get("/isAssigned/:empID",verifyRoles([userRoles.HR]),isAssigned)

router.patch("/update/:id",verifyRoles([userRoles.IT]),updateAsset)

router.get("/availableAssets/category/:assetCategories",availableAssetsCategory)

module.exports = router;
