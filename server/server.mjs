import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";

import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import fakeData from "./fakeData/index.js";

const app = express();
const httpServer = http.createServer(app);

//schema --> một tài liêụ mô tả những dữ liệu sẽ bao gồm những gì
// query -> truy vấn, mutation --> cập nhật data, subsription --> cập nhật data realtime
// typedef --> như một cuốn tài liệu định nghĩa dữ liệu dữ liệu nào sẽ thuộc KDL nào
// resolvers --> xử lý dữ liệu, trả về dữ liệu cho client dựa theo những query từ client gửi tới

const typeDefs = `#graphql
type Folder{
  id:String,
  name:String,
  createAt:String,
  author:Author
}

type Author{
  id:String,
  name:String
}
type Query{
  folders:[Folder]
}
# type Mutation{
# }
# type Subscription{
# }
`;
const resolvers = {
  Query: {
    folders: () => {
      return fakeData.folders; //<-- parent
    },
  },
  Folder: {
    author: (parent, args, context, info) => {
      const authorId = parent.authorId;
      return fakeData.authors.find((author) => author.id === authorId);
      // return { id: "123", name: "quang" };
    },
  },
};

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

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log("Server ready at http://localhost:4000/");
