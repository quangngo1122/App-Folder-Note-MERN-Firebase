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

// app.use(cors(), bodyParser.json(), expressMiddleware(server));
app.use("/graphql", cors(), express.json(), expressMiddleware(server));

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
