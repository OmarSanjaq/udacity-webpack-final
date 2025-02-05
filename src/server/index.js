// Import required dependencies
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

// Initialize the Express application
const app = express();

// Apply middleware
app.use(cors());
app.use(bodyParser.json());

/**
 * Format URL properly (if missing http/https)
 */
function formatURL(url) {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
}

/**
 * Function to scrape text from a URL
 */
async function scrapeTextFromURL(url) {
    try {
        console.log(`Fetching and scraping text from URL: ${url}`);

        // Real browser with headers
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        const { data, headers } = response;

        // Content type
        const contentType = headers["content-type"] || "Unknown";

        // HTML into Cheerio
        const $ = cheerio.load(data);

        // Text from the <article> or <body>
        const text = $("article").text().trim() || $("body").text().trim();

        if (!text) {
            console.error("No text content found at the provided URL");
            return { text: null, contentType };
        }

        const trimmedText = text.slice(0, 200);
        console.log(`Extracted Text (200 characters):\n${trimmedText}\n--- End of Text Preview ---`);
        return { text: trimmedText, contentType };
    } catch (error) {
        console.error("Error fetching text from URL:", error.message);
        throw new Error("Failed to scrape text from the URL");
    }
}

/**
 * Route to analyze text from a URL or plain text
 */
app.post("/analyze", async (req, res) => {
    const { type, url, text } = req.body;

    if (!type || (type !== "url" && type !== "text")) {
        console.error("Invalid type provided");
        return res.status(400).json({ error: "Type must be either 'url' or 'text'" });
    }

    try {
        let content = null;
        let contentType = "text/plain";

        if (type === "url") {
            if (!url) {
                console.error("No URL provided");
                return res.status(400).json({ error: "URL is required" });
            }
            const result = await scrapeTextFromURL(url);
            content = result.text;
            contentType = result.contentType;
        } else if (type === "text") {
            if (!text) {
                console.error("No text provided");
                return res.status(400).json({ error: "Text is required" });
            }
            content = text.slice(0, 200); // Trim text to 200 characters
        }

        if (!content) {
            return res.status(400).json({ error: "No content found" });
        }

        // NLP API Request
        const NLP_API_URL = "https://kooye7u703.execute-api.us-east-1.amazonaws.com/NLPAnalyzer";
        const response = await axios.post(
            NLP_API_URL,
            { text: content },
            { headers: { "Content-Type": "application/json" } }
        );

        // Full response from NLP API
        console.log("NLP API Full Response:", response.data);

        // Sentiment & subjectivity
        const sentiment = response.data.sentiment || "Unknown";
        let subjectivity = response.data.subjectivity || response.data.polarity || "Unknown";

        // Handle missing subjectivity
        if (!response.data.subjectivity && !response.data.polarity) {
            subjectivity = response.data.sentiment_scores
                ? determineSubjectivity(response.data.sentiment_scores)
                : "Unknown";
        }

        // Processed results
        return res.json({
            sentiment,
            subjectivity,
            contentType,
            preview: content,
        });
    } catch (error) {
        console.error("Error during processing:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Failed to analyze the input" });
    }
});

/**
 * Determine subjectivity if missing
 */
function determineSubjectivity(sentimentScores) {
    if (!sentimentScores) return "Unknown";

    const { Positive, Negative, Neutral, Mixed } = sentimentScores;
    const maxScore = Math.max(Positive, Negative, Neutral, Mixed);

    if (maxScore === Neutral) return "Neutral";
    if (maxScore === Positive || maxScore === Negative) return "Subjective";
    return "Unknown";
}

app.get("/", (req, res) => {
    res.send("This is the server API page. You may access its services via the client app.");
});

app.get("/test", (req, res) => {
    res.json({ message: "Server is running!" });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
