import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import requirementRouter from "./routes/requirement.routes.js";
import helmet from "helmet";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    frameAncestors: ["'self'", "https://accounts.google.com"],
    scriptSrc: ["'self'", "https://apis.google.com"],
    // Add other directives as needed
  },
}));

app.get("/", (req, res) => {
  res.send({ message: "Hello From BrickBix!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/requirement", requirementRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8080, () =>
      console.log("Server started on port http://localhost:8080"),
    );
  } catch (error) {
    console.log(error);
  }
};

export default app;

startServer();
