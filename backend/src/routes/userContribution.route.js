import { Router } from "express";
import { createUserContribution, deleteUserContribution, getUserContribution, getCurrentUserContribution, modifyUserContribution, getAllContribution, getAllContributionName } from "../controllers/userContribution.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const userContributionRouter = Router();

userContributionRouter.route("/").post(verifyAccessToken, upload.single("placeImage"), createUserContribution)
userContributionRouter.route("/").get(getUserContribution)
userContributionRouter.route("/all").get(getAllContribution)
userContributionRouter.route("/id").get(getAllContributionName)
userContributionRouter.route("/current").get(verifyAccessToken, getCurrentUserContribution)
userContributionRouter.route("/").patch(verifyAccessToken, upload.single("placeImage"), modifyUserContribution)
userContributionRouter.route("/").delete(verifyAccessToken, deleteUserContribution)

export default userContributionRouter
