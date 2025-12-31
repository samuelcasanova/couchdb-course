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
  const designDocument = await makeRequest({
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

  console.log(
    "\nQuerying the view with a date range in descending order, beware of the order of the startkey and endkey..."
  );
  await makeRequest({
    method: "GET",
    url: `${BASE_URL}/demo/_design/blog/_view/my_filter?startkey="2009/02/01 00:00:00"&endkey="2009/01/01 00:00:00"&descending=true`,
    auth: ADMIN_AUTH,
  });

  console.log("\nCreate some sample post comments...");
  await makeRequest({
    method: "POST",
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      _id: "bought-a-cat-comment-1",
      type: "comment",
      post_id: "bought-a-cat",
      body: "I went to the pet store earlier and brought home a little kitty...",
      created: "2009/02/17 21:13:39",
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
      _id: "bought-a-cat-comment-2",
      type: "comment",
      post_id: "bought-a-cat",
      body: "I went to the pet store earlier and brought home a little kitty...",
      created: "2009/03/07 20:18:39",
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
      _id: "hello-world-comment-1",
      type: "comment",
      post_id: "hello-world",
      body: "Hello world, this is a comment!",
      created: "2009/03/28 20:38:39",
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
      _id: "hello-world-comment-2",
      type: "comment",
      post_id: "hello-world",
      body: "Hello world, this is a comment!",
      created: "2009/03/29 00:38:39",
    },
  });

  console.log(
    "Updating the design document to include a new view for the comments..."
  );
  console.log(designDocument);
  await makeRequest({
    method: "PUT",
    url: `${BASE_URL}/demo/_design/blog`,
    auth: ADMIN_AUTH,
    data: {
      _id: designDocument.id,
      _rev: designDocument.rev,
      views: {
        my_filter: {
          map: "function(doc) { if(doc.date && doc.title) { emit(doc.date, doc.title); }}",
        },
        comments: {
          map: "function(doc) { if(doc.type == 'comment' && doc.post_id) { emit([doc.post_id, doc.created], doc.body); }}",
        },
      },
    },
  });

  console.log("\nQuerying the new comments view...");
  await makeRequest({
    method: "GET",
    url: `${BASE_URL}/demo/_design/blog/_view/comments?startkey=["hello-world", "2009/01/01 00:00:00"]`,
    auth: ADMIN_AUTH,
  });

  console.log("\n✓ Script completed successfully!");
}

main();
