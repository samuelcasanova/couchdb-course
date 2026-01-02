import { makeRequest, BASE_URL, ADMIN_AUTH } from "../makeRequest.js";

async function main() {
  console.log("\nCreating a new database...");
  await makeRequest({
    method: "PUT",
    url: `${BASE_URL}/bulk`,
    auth: ADMIN_AUTH,
  });

  console.log("\nCreating random documents...");
  let j = 0;
  const batchSize = 10000;
  for (let i = 1; i <= 100; i++) {
    const documents = Array.from({ length: batchSize }, () => ({
      _id: `${j}`,
      name: `Product ${j++}`,
      price: Math.floor(Math.random() * 1000),
    }));
    await makeRequest(
      {
        method: "POST",
        url: `${BASE_URL}/bulk/_bulk_docs`,
        auth: ADMIN_AUTH,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          docs: documents,
        },
      },
      false
    );
    console.log(`Inserted ${i * batchSize} documents.`);
  }
}

main();
