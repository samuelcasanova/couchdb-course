import { makeRequest, BASE_URL, REPLICA_URL, REPLICA_FROM_BASE_URL, ADMIN_AUTH } from '../makeRequest.js';

async function replicate() {
  console.log('-'.repeat(80))
  console.log('\nREPLICATION SCENARIO 1: Transient replication');
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

  console.log('-'.repeat(80))
  console.log('\nREPLICATION SCENARIO 2: Creating conflicts modifying the same document and replicating both ways');
  console.log('\nLet\'s create a conflict now with a new document, first create the document in the base database...');
  const headphones = {
    _id: 'af42c2b3-1234-5678-90ab-cdef12345678',
    name: 'Headphones',
    price: 40
  };
  const headphonesPostResponse = await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: headphones
  });

  console.log('\nNext let\'s replicate from base to replica...');
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
      }
    }
  });

  console.log('\nNext let\'s modify the document in the base database...');
  await makeRequest({
    method: 'PUT',
    url: `${BASE_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: { ...headphones, _rev: headphonesPostResponse.rev, name: 'Headphones (modified at base)' }
  });

  console.log('\nNext let\'s modify the document in the replica database...');
  await makeRequest({
    method: 'PUT',
    url: `${REPLICA_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: { ...headphones, _rev: headphonesPostResponse.rev, name: 'Headphones (modified at replica)' }
  });

  console.log('\nNow let\'s replicate from base to replica...');
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
      }
    }
  });

  console.log('\n...and from replica to base...');
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/_replicate`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      source: {
        url: `${REPLICA_FROM_BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      },
      target: {
        url: `${BASE_URL}/demo`,
        auth: {
          basic: ADMIN_AUTH
        }
      }
    }
  });

  console.log('\nNow let\'s query the document at the base database including conflicts...')
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678?conflicts=true`,
    auth: ADMIN_AUTH
  });

  console.log('\And now the same on the replica database including conflicts...')
  await makeRequest({
    method: 'GET',
    url: `${REPLICA_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678?conflicts=true`,
    auth: ADMIN_AUTH
  });

  console.log('\nGetting all the document open revs...')
  await makeRequest({
    method: 'GET',
    url: `${BASE_URL}/demo/af42c2b3-1234-5678-90ab-cdef12345678?open_revs=all`,
    auth: ADMIN_AUTH
  });

  console.log('-'.repeat(80))
  console.log('\nREPLICATION SCENARIO 3: Creating a persistent replication...')
  console.log('\nCreating the persistent replication document...')
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
  const smartTv = {
    _id: 'af42c2b3-1234-5678-90ab-1234567890ab',
    name: 'Smart TV',
    price: 500
  };
  await makeRequest({
    method: 'POST',
    url: `${BASE_URL}/demo`,
    auth: ADMIN_AUTH,
    headers: {
      'Content-Type': 'application/json'
    },
    data: smartTv
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
    url: `${REPLICA_URL}/demo/af42c2b3-1234-5678-90ab-1234567890ab`,
    auth: ADMIN_AUTH
  });
}

replicate();