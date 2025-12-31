import connect from "nano";
import { BASE_URL, ADMIN_AUTH } from "../makeRequest.js";

async function main() {
  console.log("Connecting to the database...");
  const nano = connect({ url: BASE_URL });
  await nano.auth(ADMIN_AUTH.username, ADMIN_AUTH.password);

  console.log("\nListing all databases...");
  const databases = await nano.db.list();
  console.log(databases);
}

main();
