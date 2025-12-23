import axios from 'axios';

export const BASE_URL = 'http://localhost:5984';
export const REPLICA_URL = 'http://localhost:5985';
export const REPLICA_FROM_BASE_URL = 'http://couchdb-replica:5984';

export const ADMIN_AUTH = { username: 'admin', password: 'password' };
export const SAMUEL_AUTH = { username: 'samuel', password: 'password' };

export async function makeRequest(config, logResponse = true) {
  try {
    const response = await axios(config);
    if (logResponse) {
      console.log(JSON.stringify(response.data, null, 2));
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}
