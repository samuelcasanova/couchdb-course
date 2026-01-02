import { makeRequest, BASE_URL, ADMIN_AUTH } from "../makeRequest.js";

async function main() {
  console.log(
    "\nUsing mango query to query the bulk database without index..."
  );
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/bulk/_find`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      selector: {
        $and: [
          {
            name: {
              $regex: "Product 1?2.*",
            },
          },
          {
            price: {
              $gt: 500,
            },
          },
          {
            price: {
              $lt: 600,
            },
          },
        ],
      },
      execution_stats: true,
    },
  });

  console.log("\nCreating index...");
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/bulk/_index`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      index: {
        fields: ["price", "name"],
      },
    },
  });

  console.log(
    "\nSame query with the index, first call (it should create the index first)..."
  );
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/bulk/_find`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      selector: {
        $and: [
          {
            name: {
              $regex: "Product 1?2.*",
            },
          },
          {
            price: {
              $gt: 500,
            },
          },
          {
            price: {
              $lt: 600,
            },
          },
        ],
      },
      execution_stats: true,
    },
  });

  console.log("\nSame query with the index, second call...");
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/bulk/_find`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      selector: {
        $and: [
          {
            name: {
              $regex: "Product 1?2.*",
            },
          },
          {
            price: {
              $gt: 500,
            },
          },
          {
            price: {
              $lt: 600,
            },
          },
        ],
      },
      execution_stats: true,
    },
  });
}

main();
