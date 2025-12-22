# CouchDB Course

A hands-on learning repository for exploring Apache CouchDB, a NoSQL document database with a focus on ease of use and having a scalable architecture.

## 📋 Overview

This repository contains practical examples and exercises for learning CouchDB fundamentals. It provides a ready-to-use Docker environment and example scripts to help you understand core CouchDB concepts including database creation, document management, and user administration.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system
- `curl` command-line tool (for running example scripts)
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

3. **Clean and reset the environment:**
   ```bash
   ./clean.sh
   ```
   This script will stop the container, remove all data, and restart with a fresh instance.

## 📚 Course Content

### Introduction (`src/intro/init.sh`)

The introduction script covers fundamental CouchDB operations:

- **Server Information**: Verify CouchDB is running
- **System Databases**: Create required system databases (`_users`, `_replicator`, `_global_changes`)
- **Database Operations**: Create and list databases
- **Document Management**: Create and retrieve JSON documents
- **User Administration**: 
  - Create admin users
  - Create regular users with roles
  - List all users

**Run the introduction tutorial:**
```bash
cd src/intro
./init.sh
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
