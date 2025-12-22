#!/bin/bash


curl 'http://admin:password@localhost:5984/_replicator' \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"user_ctx":{"name":"admin","roles":["_admin","_reader","_writer"]},"source":{"url":"http://localhost:5984/demo","headers":{"Authorization":"Basic YWRtaW46cGFzc3dvcmQ="}},"target":{"url":"http://localhost:5985/demo","headers":{"Authorization":"Basic YWRtaW46cGFzc3dvcmQ="}},"create_target":true,"continuous":false}'