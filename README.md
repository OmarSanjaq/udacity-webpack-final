Overview
This project analyzes the sentiment of website URLs or user-entered plain text using an NLP API. Built with Node.js, Express, Webpack, and Sass, it demonstrates essential web development skills, including API integration, service workers, and responsive design. Users can input either a URL to scrape and analyze text from a webpage or directly enter text for sentiment analysis.

Features
Webpack setup with loaders and plugins for efficient development and production builds.

API integration for sentiment analysis using an external NLP API.

Dynamic UI updates based on analysis results, displaying sentiment, subjectivity, and a preview of the analyzed content.

Support for both URL and plain text input:

URL Input: Scrapes text from the provided webpage and analyzes it.

Plain Text Input: Directly analyzes the text entered by the user.

Service worker for offline functionality and improved performance.

Jest testing for validation and ensuring code reliability.

Setup
Install dependencies:

npm install
Run the project:

For the front-end:
npm run build-dev

For the back-end server:

npm start

Open the application in your browser and:
Enter a website URL to analyze text from a webpage.
Or, enter plain text directly for sentiment analysis.

Developer
Built by Omar Sanjaq
