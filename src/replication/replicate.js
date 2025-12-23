import { makeRequest, BASE_URL, REPLICA_FROM_BASE_URL, ADMIN_AUTH } from '../makeRequest.js';

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

  console.log('\n✓ Replication completed successfully!');
}

replicate();