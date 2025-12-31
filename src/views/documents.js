import { makeRequest, BASE_URL, ADMIN_AUTH } from "../makeRequest.js";

async function main() {
  console.log("\nCreating the database...");
  await makeRequest({
    method: "PUT",
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
  });

  console.log("\nCreating 3 sample post documents...");
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      _id: "biking",
      title: "Biking",
      body: "My biggest hobby is mountainbiking. The other day...",
      date: "2009/01/30 18:04:11",
    },
  });

  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      _id: "bought-a-cat",
      title: "Bought a Cat",
      body: "I went to the pet store earlier and brought home a little kitty...",
      date: "2009/02/17 21:13:39",
    },
  });

  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      _id: "hello-world",
      title: "Hello World",
      body: "Well hello and welcome to my new blog...",
      date: "2009/01/15 15:52:20",
    },
  });

  console.log("\nCreating a view...");
  await makeRequest({
    method: "PUT",
    url: `${BASE_URL}/demo/_design/blog`,
    auth: ADMIN_AUTH,
    data: {
      views: {
        my_filter: {
          map: "function(doc) { if(doc.date && doc.title) { emit(doc.date, doc.title); }}",
        },
      },
    },
  });

  console.log("\nQuerying the view...");
  await makeRequest({
    method: "GET",
    url: `${BASE_URL}/demo/_design/blog/_view/my_filter`,
    auth: ADMIN_AUTH,
  });

  console.log("\nQuerying the view including the documents...");
  await makeRequest({
    method: "GET",
    url: `${BASE_URL}/demo/_design/blog/_view/my_filter?include_docs=true`,
    auth: ADMIN_AUTH,
  });

  console.log("\nQuerying the view with a date constraint...");
  await makeRequest({
    method: "GET",
    url: `${BASE_URL}/demo/_design/blog/_view/my_filter?key="2009/01/30 18:04:11"`,
    auth: ADMIN_AUTH,
  });

  console.log("\n✓ Script completed successfully!");
}

main();
