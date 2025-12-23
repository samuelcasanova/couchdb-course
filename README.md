# CouchDB Course

A hands-on learning repository for exploring Apache CouchDB, a NoSQL document database with a focus on ease of use and having a scalable architecture.

## 📋 Overview

This repository contains practical examples and exercises for learning CouchDB fundamentals. It provides a ready-to-use Docker environment and example scripts to help you understand core CouchDB concepts including database creation, document management, and user administration.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- Node.js (v14 or higher) and npm installed
- Basic understanding of REST APIs and JSON

### Quick Start

1. **Start the CouchDB server:**
   ```bash
   docker compose up -d
   ```

2. **Access CouchDB:**
   - Web Interface (Fauxton): http://localhost:5984/_utils
   - API Endpoint: http://localhost:5984
   - Default credentials:
     - Username: `admin`
     - Password: `password`

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Clean and reset the environment:**
   ```bash
   npm run clean
   ```
   This command will stop the container, remove all data, and restart with a fresh instance.

## 📚 Course Content

### Available Scripts

The repository includes several npm scripts to help you learn CouchDB:

#### `npm run init`
Runs the introduction tutorial (`src/intro/init.js`) which covers fundamental CouchDB operations:
- **Server Information**: Verify CouchDB is running
- **System Databases**: Create required system databases (`_users`, `_replicator`, `_global_changes`)
- **Database Operations**: Create and list databases
- **User Administration**: 
  - Create admin users
  - Create regular users with roles
  - List all users

#### `npm run documents`
Runs the document management tutorial (`src/intro/documents.js`) which demonstrates:
- **Document Creation**: Create JSON documents in CouchDB
- **Document Retrieval**: Fetch and display documents
- **Document Updates**: Modify existing documents

#### `npm run fauxton`
Opens the CouchDB web interface (Fauxton) in your default browser.

#### `npm run clean`
Resets the entire environment by stopping containers, removing data, and restarting fresh.

#### `npm run all`
Runs a complete workflow: clean the environment, run the init tutorial, and then run the documents tutorial.

#### `npm run replicate`
Replicates the demo database from the primary server to the replica server

**Run the complete tutorial:**
```bash
npm run all
```

## 📖 Learning Resources

- [Official CouchDB Documentation](https://docs.couchdb.org/)
- [CouchDB: The Definitive Guide](http://guide.couchdb.org/)
- [CouchDB API Reference](https://docs.couchdb.org/en/stable/api/index.html)

## 🔒 Security Note

⚠️ **Important**: This setup uses default credentials (`admin`/`password`) and is intended for **local development and learning purposes only**. Never use these credentials in production environments.

## 📝 License

This is a personal learning repository. Feel free to use it for educational purposes.

**Happy Learning! 🎓**
