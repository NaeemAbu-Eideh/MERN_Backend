# create project folder
mkdir your-project-name
cd your-project-name

# backend folder
mkdir server
cd server

# init npm
npm init -y

# core deps
npm i express mongoose dotenv

# create files
touch server.js
touch .env
touch .gitignore

# will cover later on ->>>
npm install cors
npm install socket.io

# AI SDK
npm i openai
