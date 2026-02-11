import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import fakeData from "./fakeData/index.js";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import "dotenv/config";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";

const app = express();
const httpServer = http.createServer(app);

//schema --> một tài liêụ mô tả những dữ liệu sẽ bao gồm những gì
// query -> truy vấn, mutation --> cập nhật data, subsription --> cập nhật data realtime
// typedef --> như một cuốn tài liệu định nghĩa dữ liệu dữ liệu nào sẽ thuộc KDL nào
// resolvers --> xử lý dữ liệu, trả về dữ liệu cho client dựa theo những query từ client gửi tới

const URL = process.env.DB_CONNECT;
const PORT = process.env.PORT || 4000;

// create apoloserver
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

//mjs thì ko cần bọc await trong func async
await server.start();

const authorizationJWT = async (req, res, next) => {
  // console.log({ authorization: req.headers.authorization });
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.locals.uid = null;
    return next();
  }
  if (authorizationHeader) {
    // phần tử 0 là bearer phần tử 1 là accesstoken
    const accessToken = authorizationHeader.split(" ")[1];
    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        // console.log({ decodedToken });
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        console.log(err);
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// app.use(cors(), bodyParser.json(), expressMiddleware(server));
app.use(
  "/graphql",
  cors(),
  authorizationJWT,
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { uid: res.locals.uid };
    },
  }),
);

//--> Mongoose ≤ 5
// mongoose
//   .connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })

//-->Mongoose 7/8
mongoose.connect(URL, {}).then(async () => {
  console.log("connected to DB");
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log("Server ready at http://localhost:4000/");
});
