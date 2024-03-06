import express from "express"
import { baseApiReply, baseReply, endpointNotFound } from "./controllers/base.controllers.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import moment from "moment-timezone";

const app = express();
app.on("error", error => console.log(`Error occurred on creating express app: ${error}`))


// middleware to set nepali time
app.use((req, res, next) => {
  // Set the timezone to Nepali  
  moment.tz.setDefault('Asia\Kathmandu');
  // Proceed to the next middleware  
  next();
});


//handle CORS access
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))


//middlewares 
app.use(express.json());//parse JSON data
app.use(express.urlencoded({ extended: true })); //parse form data 
app.use(express.static("public")) //store some assets in public
app.use(cookieParser())//parse cookies(access token)


//routes
app.route("/").get(baseReply)
app.route("/api/v1").get(baseApiReply)
// app.route("/api/v1/auth/register").post(register)

import authRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRoutes)


import { verifyAccessToken } from "./middlewares/auth.middleware.js";
import secretRouter from "./routes/protected.routes.js";

//app.use(verifyAccessToken)
app.use("/api/v1/protected", verifyAccessToken, secretRouter)

import userContributionRouter from "./routes/userContribution.route.js";
app.use("/api/v1/contribution", userContributionRouter)


// import listRouter from "./routes/list.routes.js";
// app.use("/api/v1/list/", listRouter)

app.route("/*")
  .get(endpointNotFound)
  .post(endpointNotFound)
  .patch(endpointNotFound)
  .put(endpointNotFound)
  .delete(endpointNotFound);

export default app
