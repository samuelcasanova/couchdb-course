import { makeRequest, BASE_URL, REPLICA_URL, REPLICA_FROM_BASE_URL, ADMIN_AUTH } from '../makeRequest.js';

async function replicate() {
  console.log('\nReplicating demo database to the replica database...');
  
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/_replicate`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      source: {
        url: `${BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      },
      target: {
        url: `${REPLICA_FROM_BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      },
      create_target: true
    }
  });
  console.log('\n✓ Transient replication completed successfully!');

  console.log('\nCreating a persistent replication (scheduled)...')
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/_replicator`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      _id: 'demo-persistent-replication',
      source: {
        url: `${BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      },
      target: {
        url: `${REPLICA_FROM_BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      },
      continuous: true
    }
  });
  console.log('\n✓ Persistent replication document created, now let\'s check its status...');
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/_scheduler/docs/_replicator/demo-persistent-replication`,
    auth: ADMIN_AUTH
  });

  console.log('\nNow let\'s create a new product document in the demo database...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      _id: 'af42c2b3-1234-5678-90ab-cdef12345678',
      name: 'Headphones',
      price: 40
    }
  });

  let attempt = 1;
  while (attempt <= 100) {
    console.log(`Querying the replication state if it\'s completed, attempt ${attempt++}/100...`);
    const replicationDoc = await makeRequest({
        method: 'GET',
        url: `${BASE_URL}/_scheduler/docs/_replicator/demo-persistent-replication`,
        auth: ADMIN_AUTH
    }, false);
    if (replicationDoc.info?.changes_pending === 0) {
        break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nReplica stopped updating, now let\'s query the replica database to find the new document...')
  await makeRequest({
    method: 'GET',
    url: `${REPLICA_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678`,
    auth: ADMIN_AUTH
  });
}

replicate();