import { checkForName } from './nameChecker';

const serverURL = 'http://localhost:8080/analyze';

document.getElementById('urlForm').addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    // Get input value
    const formText = document.getElementById('name').value;

    // Determine if the input is a URL or plain text
    const type = isValidURL(formText) ? "url" : "text";

    try {
        // Send request to the server
        const response = await fetch(serverURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, [type]: formText }) // Send type and the input
        });

        const data = await response.json();

        // Check if API responded with an error
        if (data.error) {
            throw new Error(data.error);
        }

        // Update the UI with the results
        document.getElementById('results').innerHTML = `
            <p>Sentiment: ${data.sentiment || "Unknown"}</p>
            <p>Subjectivity: ${data.subjectivity || "Unknown"}</p>
            <p>Content Type: ${data.contentType || "text/plain"}</p>
            <p>Extracted Text: ${data.preview || "No preview available"}</p>
        `;
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to analyze the input. Please try again.");
    }
}

// Validate URLs using Regex
function isValidURL(url) {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    return regex.test(url);
}

export { handleSubmit };
