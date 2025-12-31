import { makeRequest, BASE_URL, ADMIN_AUTH } from "../makeRequest.js";

async function main() {
  console.log("\nUsing mango queries to query the demo database...");
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/demo/_find`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      selector: {
        $or: [
          {
            type: "post",
            date: {
              $lt: "2009/02/01 00:00:00",
            },
          },
          {
            title: {
              $regex: "Cat$",
            },
          },
        ],
      },
    },
  });
}

main();
