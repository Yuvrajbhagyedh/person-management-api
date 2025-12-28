# MongoDB Setup Guide

## Issue: MongoDB Connection Error

If you're seeing the error: **"Operation `people.find()` buffering timed out"**, it means MongoDB is not running or not accessible.

## Quick Solutions

### Option 1: Install and Start MongoDB Locally

#### For Windows:
1. **Install MongoDB Community Server:**
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer and follow the setup wizard
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service

2. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

3. **If MongoDB service doesn't exist, start it manually:**
   ```powershell
   # Navigate to MongoDB bin directory (usually)
   cd "C:\Program Files\MongoDB\Server\<version>\bin"
   mongod.exe --dbpath "C:\data\db"
   ```
   (You may need to create the `C:\data\db` directory first)

#### For Linux:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

#### For Mac:
```bash
brew services start mongodb-community
# or
mongod --config /usr/local/etc/mongod.conf
```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. **Sign up at:** https://www.mongodb.com/cloud/atlas/register
2. **Create a free cluster**
3. **Get your connection string** (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/persondb`)
4. **Set the connection string:**
   ```powershell
   # Windows PowerShell
   $env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/persondb"
   ```
   ```bash
   # Linux/Mac
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/persondb"
   ```

### Option 3: Use Docker (if you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verify MongoDB is Running

### Check if MongoDB is accessible:
```powershell
# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port 27017

# Should show: TcpTestSucceeded : True
```

```bash
# Linux/Mac
mongosh
# or
mongo
```

## After Starting MongoDB

1. **Restart your Node.js server:**
   ```powershell
   npm start
   ```
   or if using port 3001:
   ```powershell
   $env:PORT=3001; npm start
   ```

2. **Visit:** http://localhost:3001/person (or http://localhost:3000/person)

3. **You should see:** "People Management" page instead of connection error

## Troubleshooting

### Port 27017 is already in use:
- Another MongoDB instance might be running
- Check with: `netstat -ano | findstr :27017` (Windows)
- Kill the process or use a different port

### Permission errors:
- On Windows: Run PowerShell/Command Prompt as Administrator
- On Linux/Mac: Use `sudo` for service commands

### Connection string format:
- Local: `mongodb://localhost:27017/persondb`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/persondb`


