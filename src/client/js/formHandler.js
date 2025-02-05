import { checkForName } from './nameChecker';

const serverURL = 'http://localhost:8080/analyze-url';

document.getElementById('urlForm').addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    // URL from the input field
    const formText = document.getElementById('name').value;

    // validate URL input
    if (!formText || !isValidURL(formText)) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        // Send request
        const response = await fetch(serverURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formText })
        });

        const data = await response.json();

        // Check if API respond
        if (data.error) {
            throw new Error(data.error);
        }

        // Update the UI 
        document.getElementById('results').innerHTML = `
            <p>Sentiment: ${data.sentiment || "Unknown"}</p>
            <p>Content Type: ${data.subjectivity || "Unknown"}</p>
            <p>Extracted Text: ${data.preview || "No preview available"}</p>
        `;
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze the URL. Please try again.");
    }
}

// validate URLs using Regex
function isValidURL(url) {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    return regex.test(url);
}


export { handleSubmit };
