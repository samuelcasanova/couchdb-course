import path from 'path';
import fs from 'fs';
import { makeRequest, BASE_URL, ADMIN_AUTH, SAMUEL_AUTH } from '../makeRequest.js';

async function main() {
  console.log('\nCreating some sample product documents...');
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b72',
    name: 'Laptop',
    price: 1000
  });
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b73',
    name: 'Smartphone',
    price: 500
  });
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b74',
    name: 'Tablet',
    price: 300
  });
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b75',
    name: 'Monitor',
    price: 200
  });
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b76',
    name: 'Keyboard',
    price: 50
  });
  await createProduct({
    _id: 'df77d45cfa779c82430c4faa17000b77',
    name: 'Mouse',
    price: 30
  });

  console.log('\nCreating an index for the price field to optimize performance in the next query...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo/_index`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      index: {
        fields: ['price']
      },
      name: 'price-json-index',
      type: 'json'
    }
  });

  console.log('\nAsking for a specific document...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH
  });

  console.log('\nQuerying the database for products between 80 and 4000...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo/_find`,
    auth: SAMUEL_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      selector: {
        price: {
          $lt: 4000,
          $gte: 80
        }
      },
      limit: 21,
      skip: 0
    }
  });

  console.log('\nTelling CouchDB to generate UUIDs for us...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/_uuids?count=1`,
    auth: ADMIN_AUTH
  });

  console.log('\nTrying to update a document without a revision: it should fail...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      name: 'Laptop',
      price: 1100
    }
  });

  console.log('\nTrying to update a document with a revision: it should work...');
  const document = await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH
  }, false);

  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {...document, price: 1100}
  });

  console.log('\nAttaching an image to the document...');
  const updatedDocument = await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH
  }, false);

  const imagePath = path.join(import.meta.dirname, 'product.png');
  const imageData = fs.readFileSync(imagePath);
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72/product.png?rev=${updatedDocument._rev}`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'image/png'
    },
    data: imageData
  });

  console.log('\nGetting the document with the attachment...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72?attachments=true`,
    auth: ADMIN_AUTH
  });

  console.log('\n✓ Script completed successfully!');
}

console.log('\nUpdated document with the attachment...');
await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b72`,
    auth: ADMIN_AUTH
  });


async function createProduct(productData) {
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: productData
  });
}

main();
