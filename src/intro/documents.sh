#!/bin/bash

echo -e "\nCreating some sample product documents..."
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b72", "name": "Laptop", "price": 1000}'
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b73", "name": "Smartphone", "price": 500}'
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b74", "name": "Tablet", "price": 300}'
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b75", "name": "Monitor", "price": 200}'
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b76", "name": "Keyboard", "price": 50}'
curl -H 'Content-Type: application/json' \
    -X POST http://admin:password@localhost:5984/demo \
    -d '{"_id": "df77d45cfa779c82430c4faa17000b77", "name": "Mouse", "price": 30}'

echo -e "\nCreating an index for the price field to optimize performance in the next query..."
curl -H 'Content-Type: application/json' \
    -X POST 'http://admin:password@localhost:5984/demo/_index' \
    -d '{"index": {"fields": ["price"]}, "name": "price-json-index", "type": "json"}'

echo -e "\nQuerying the database for products between 80 and 4000..."
curl -H 'Content-Type: application/json' \
    -X POST 'http://samuel:password@localhost:5984/demo/_find' \
    -d '{"selector":{"price":{"$lt":4000,"$gte":80}},"limit":21,"skip":0}'