# 🚀 Quick Setup Instructions

Follow these steps to get your AI Website Generator running in 5 minutes!

## Step 1: Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

## Step 2: Setup Backend
```bash
# Open Terminal/Command Prompt
cd backend

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Edit .env file and add your API key:
# OPENAI_API_KEY=sk-your-actual-key-here
```

## Step 3: Setup Frontend
```bash
# Open another Terminal/Command Prompt
cd frontend

# Install dependencies
npm install
```

## Step 4: Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
✅ Backend running on http://localhost:5000

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## Step 5: Test It!
1. Open http://localhost:3000 in your browser
2. Type: "Create a modern portfolio website for a graphic designer"
3. Click "Generate Website"
4. Wait 10-30 seconds for AI to create your website
5. See the live preview on the right!

## 🎉 You're Done!

Your AI Website Generator is now running! Try different prompts:
- "Build a coffee shop website with menu"
- "Create a tech blog with dark theme"
- "Design a restaurant landing page"

## 🆘 Need Help?
- Check the full README.md for detailed instructions
- Make sure both servers are running
- Verify your OpenAI API key is correct
- Check your OpenAI account has credits

Happy generating! 🚀
