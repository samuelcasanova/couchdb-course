#!/bin/bash

echo -e "\nGetting CouchDB server information..."
curl http://localhost:5984

echo -e "\nCreating system databases, needed for the server to start up correctly..."
curl -X PUT http://admin:password@localhost:5984/_users
curl -X PUT http://admin:password@localhost:5984/_replicator
curl -X PUT http://admin:password@localhost:5984/_global_changes


echo -e "\nCreating a new database..."
curl -X PUT http://admin:password@localhost:5984/demo
echo -e "\nListing all databases..."
curl http://admin:password@localhost:5984/_all_dbs
echo -e "\nGetting the demo db information..."
curl http://admin:password@localhost:5984/demo

echo -e "\nCreating a new document..."
curl -H 'Content-Type: application/json' \
            -X POST http://admin:password@localhost:5984/demo \
            -d '{"_id": "df77d45cfa779c82430c4faa17000b71", "company": "Example, Inc."}'
echo -e "\nGetting the document information..."
curl http://admin:password@localhost:5984/demo/df77d45cfa779c82430c4faa17000b71

echo -e "\nCreating a new admin user..."
curl -X PUT http://admin:password@localhost:5984/_node/_local/_config/admins/anna -d '"secret"'

echo -e "\nCreating a new user..."
curl -X PUT http://admin:password@localhost:5984/_users/org.couchdb.user:samuel \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "samuel", "password": "password", "roles": ["demo_admin"], "type": "user"}'

echo -e "\nListing all users..."
curl http://admin:password@localhost:5984/_users/_all_docs

echo -e "\nLogging in as samuel..."
curl -X POST http://localhost:5984/_session -d 'name=samuel&password=password'

echo -e "\nSetting samuel as a member of the demo database..."
curl -X PUT http://admin:password@localhost:5984/demo/_security \
     -H "Content-Type: application/json" \
     -d '{"admins": { "names": [], "roles": ["demo_admin"] }, "members": { "names": ["samuel"], "roles": [] } }'

echo -e "\nTrying to access the demo database as samuel as a member and also as admin with the demo_admin role..."
curl -u samuel:password http://localhost:5984/demo
