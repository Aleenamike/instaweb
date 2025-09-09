# AI-Powered Static Website Generator MVP

A full-stack application that generates beautiful, responsive websites using AI (OpenAI GPT-4) based on natural language prompts.

## 🚀 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 to create complete HTML/CSS websites
- **Real-time Preview**: Live iframe preview of generated websites
- **Modern UI**: Beautiful React frontend with TailwindCSS
- **Responsive Design**: Works on desktop and mobile devices
- **Generation History**: Keep track of recent generations
- **Download HTML**: Download generated websites as HTML files
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - GPT-4 integration
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request parsing middleware

### Future Features (Planned)
- **MongoDB Atlas** - Database for saving prompts and websites
- **ZIP Downloads** - Download complete website packages
- **Templates** - Pre-built website templates
- **User Authentication** - User accounts and saved projects

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **OpenAI API Key** (get from [OpenAI Platform](https://platform.openai.com/api-keys))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd 3rdsem

# The project structure is already created
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy env.example .env

# Edit .env file and add your OpenAI API key
# OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and paste it in your `backend/.env` file

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### 6. Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Enter a prompt like: "Create a modern portfolio website for a graphic designer"
3. Click "Generate Website" and wait for the AI to create your website
4. View the live preview in the right panel
5. Download the HTML file if you like the result

## 📁 Project Structure

```
3rdsem/
├── backend/
│   ├── server.js          # Express server with OpenAI integration
│   ├── package.json       # Backend dependencies
│   ├── env.example        # Environment variables template
│   └── .env              # Your actual environment variables (create this)
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Custom styles
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles with TailwindCSS
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.js # TailwindCSS configuration
│   └── postcss.config.js  # PostCSS configuration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### API Endpoints

- `GET /health` - Health check endpoint
- `POST /generate` - Generate website from prompt
- `POST /save-prompt` - Placeholder for future MongoDB integration
- `POST /download` - Placeholder for future ZIP download feature

## 💡 Usage Examples

Try these prompts to get started:

### Portfolio Websites
- "Create a modern portfolio website for a graphic designer with dark theme"
- "Build a photographer's portfolio with image gallery and contact form"
- "Design a developer's portfolio with project showcase and skills section"

### Business Websites
- "Create a landing page for a coffee shop with menu and location"
- "Build a restaurant website with online ordering system"
- "Design a tech startup landing page with pricing plans"

### Blog/Content Sites
- "Create a tech blog with dark theme and clean typography"
- "Build a travel blog with beautiful image layouts"
- "Design a cooking blog with recipe cards and search"

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot connect to server" error**
- Make sure the backend is running on port 5000
- Check that you have the correct API URL in your environment

**2. "Invalid OpenAI API key" error**
- Verify your API key is correct in the `.env` file
- Make sure you have credits in your OpenAI account

**3. "OpenAI API quota exceeded" error**
- Check your OpenAI billing and usage limits
- Consider upgrading your OpenAI plan

**4. Frontend not loading**
- Make sure you're running `npm start` in the frontend directory
- Check that port 3000 is not being used by another application

### Development Tips

- Use `npm run dev` in the backend for auto-restart during development
- Check browser console for any JavaScript errors
- Use browser dev tools to inspect network requests
- Check terminal logs for backend errors

## 🔮 Future Enhancements

### Phase 2 Features
- **MongoDB Integration**: Save prompts and generated websites
- **User Authentication**: User accounts and project management
- **ZIP Downloads**: Download complete website packages with assets
- **Template Library**: Pre-built website templates
- **Custom Domains**: Deploy generated websites to custom domains

### Phase 3 Features
- **AI Image Generation**: Generate images for websites using DALL-E
- **Advanced Customization**: Fine-tune AI prompts and styles
- **Collaboration**: Share and collaborate on website projects
- **Analytics**: Track website performance and user engagement

## 📚 Learning Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a semester project MVP. For future development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a semester project.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all dependencies are installed correctly
3. Ensure your OpenAI API key is valid and has credits
4. Check that both frontend and backend servers are running

---

**Happy Coding! 🚀**

*Built with ❤️ for learning and innovation*
