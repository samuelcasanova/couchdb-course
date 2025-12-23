import { makeRequest, BASE_URL, SAMUEL_AUTH, ADMIN_AUTH, REPLICA_URL } from '../makeRequest.js';

async function main() {
  console.log('\nGetting CouchDB server information...');
  await makeRequest({
    method: 'GET',
    url: BASE_URL
  });

  console.log('\nCreating system databases, needed for the server to start up correctly...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/_users`,
    auth: ADMIN_AUTH
  });
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/_replicator`,
    auth: ADMIN_AUTH
  });
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/_global_changes`,
    auth: ADMIN_AUTH
  });

  console.log('\nThe same config for the replica...');
  await makeRequest({
    method: 'PUT',
    url: `${REPLICA_URL}/_users`,
    auth: ADMIN_AUTH
  });
  await makeRequest({
    method: 'PUT',
    url: `${REPLICA_URL}/_replicator`,
    auth: ADMIN_AUTH
  });
  await makeRequest({
    method: 'PUT',
    url: `${REPLICA_URL}/_global_changes`,
    auth: ADMIN_AUTH
  });

  console.log('\nCreating a new database...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH
  });

  console.log('\nListing all databases...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/_all_dbs`,
    auth: ADMIN_AUTH
  });

  console.log('\nGetting the demo db information...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH
  });

  console.log('\nCreating a new document...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      _id: 'df77d45cfa779c82430c4faa17000b71',
      company: 'Example, Inc.'
    }
  });

  console.log('\nGetting the document information...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/df77d45cfa779c82430c4faa17000b71`,
    auth: ADMIN_AUTH
  });

  console.log('\nCreating a new admin user...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/_node/_local/_config/admins/anna`,
    auth: ADMIN_AUTH,
    data: '"secret"',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('\nCreating a new user...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/_users/org.couchdb.user:samuel`,
    auth: ADMIN_AUTH,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: {
      name: 'samuel',
      password: 'password',
      roles: ['demo_admin'],
      type: 'user'
    }
  });

  console.log('\nListing all users...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/_users/_all_docs`,
    auth: ADMIN_AUTH
  });

  console.log('\nLogging in as samuel...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/_session`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'name=samuel&password=password'
  });

  console.log('\nSetting samuel as a member of the demo database...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo/_security`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      admins: {
        names: [],
        roles: ['demo_admin']
      },
      members: {
        names: ['samuel'],
        roles: []
      }
    }
  });

  console.log('\nTrying to access the demo database as samuel as a member and also as admin with the demo_admin role...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo`,
    auth: SAMUEL_AUTH
  });

  console.log('\n✓ Script completed successfully!');
}

main();
