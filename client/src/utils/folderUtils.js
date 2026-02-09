import { graphQLRequest } from "./request";

export const foldersLoader = async () => {
  const query = `query ExampleQuery {
                folders {
                  id
                  name
                  createAt
                }
              }
              `;

  const data = await graphQLRequest({ query });

  // const res = await fetch("http://localhost:4000/graphql", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify({
  //     query,
  //   }),
  // });
  // const { data } = await res.json();

  // console.log({ data });
  return data;
};
