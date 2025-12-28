# Deployment Guide

This guide will help you push your code to GitHub and deploy it live.

## Step 1: Push to GitHub

### Initialize Git and Push

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Person Management REST API"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Create a new repository (don't initialize with README)
   - Copy the repository URL

3. **Add remote and push:**
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas (Free Cloud Database)

Since we need MongoDB for hosting, use MongoDB Atlas (free tier):

1. **Sign up at:** https://www.mongodb.com/cloud/atlas/register
2. **Create a free cluster** (M0 Sandbox)
3. **Create a database user:**
   - Database Access → Add New Database User
   - Username and password (save these!)
4. **Whitelist IP addresses:**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for testing
5. **Get connection string:**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `persondb`
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/persondb`

## Step 3: Deploy to Hosting Platform

Choose one of these platforms:

### Option A: Render (Recommended - Free Tier Available)

1. **Sign up:** https://render.com
2. **New → Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Name: `person-management-api` (or any name)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. **Add Environment Variable:**
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)
8. **Your app will be live at:** `https://your-app-name.onrender.com`

### Option B: Railway

1. **Sign up:** https://railway.app
2. **New Project → Deploy from GitHub repo**
3. **Select your repository**
4. **Add Environment Variable:**
   - Variable: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
5. **Deploy automatically starts**
6. **Your app will be live at:** `https://your-app-name.up.railway.app`

### Option C: Fly.io

1. **Install Fly CLI:** https://fly.io/docs/hands-on/install-flyctl/
2. **Sign up:** `fly auth signup`
3. **Create app:** `fly launch`
4. **Set environment variable:**
   ```bash
   fly secrets set MONGODB_URI="your-mongodb-atlas-connection-string"
   ```
5. **Deploy:** `fly deploy`
6. **Your app will be live at:** `https://your-app-name.fly.dev`

### Option D: Heroku (Requires Credit Card, but has free tier)

1. **Install Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli
2. **Login:** `heroku login`
3. **Create app:** `heroku create your-app-name`
4. **Set MongoDB URI:**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   ```
5. **Deploy:**
   ```bash
   git push heroku main
   ```
6. **Your app will be live at:** `https://your-app-name.herokuapp.com`

## Step 4: Verify Deployment

1. Visit your deployed URL
2. Go to `/person` endpoint
3. Try creating a new person
4. Verify data is being saved to MongoDB Atlas

## Important Notes

- **MongoDB Atlas:** Make sure your IP is whitelisted (or use 0.0.0.0/0 for testing)
- **Environment Variables:** Never commit `.env` file to Git (already in .gitignore)
- **Connection String:** Keep your MongoDB Atlas connection string secret
- **Free Tier Limits:**
  - Render: May sleep after 15 minutes of inactivity (free tier)
  - Railway: Limited monthly usage (free tier)
  - Fly.io: Limited resources (free tier)

## Troubleshooting

### App shows MongoDB connection error:
- Verify MongoDB Atlas connection string is correct
- Check IP whitelist in MongoDB Atlas
- Verify environment variable is set correctly in hosting platform

### App doesn't start:
- Check build logs in hosting platform
- Verify `package.json` has correct start script
- Check Node.js version compatibility

### Cannot connect to database:
- MongoDB Atlas cluster might be paused (free tier)
- Check database user credentials
- Verify connection string format

