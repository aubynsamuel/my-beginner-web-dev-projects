let ws; // WebSocket connection
let playerId; // Will be 1 or 2
let userScore = 0;
let opponentScore = 0;

const opponentCDisplay = document.getElementById("Computer");
const userCDisplay = document.getElementById("user");
const resultDisplay = document.getElementById("result");
const score = document.getElementById("scores");

// Function to connect to the WebSocket server
function connectToServer() {
    ws = new WebSocket("ws://192.168.126.88:8000"); // Connect to the WebSocket server

    ws.onopen = () => {
        console.log("Connected to server");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.message) {
            resultDisplay.textContent = data.message;
            if (data.message === "Game starting...") {
                playerId = data.player; // Assign player ID
                console.log(`You are Player ${playerId}`);
            }
        } else {
            // Game data received
            handleGameData(data);
        }
    };

    ws.onclose = () => {
        console.log("Disconnected from server");
    };
}

function handleGameData(data) {
    const player1Choice = data.player1Choice;
    const player2Choice = data.player2Choice;

    // Display the choices
    if (playerId === 1) {
        userCDisplay.textContent = `Your Choice: ${player1Choice}`;
        opponentCDisplay.textContent = `Opponent's Choice: ${player2Choice}`;
    } else {
        userCDisplay.textContent = `Your Choice: ${player2Choice}`;
        opponentCDisplay.textContent = `Opponent's Choice: ${player1Choice}`;
    }

    // Display the result
    resultDisplay.textContent = data.result;

    // Update scores
    if (data.result.startsWith("Player 1 wins")) {
        if (playerId === 1) {
            userScore++;
        } else {
            opponentScore++;
        }
    } else if (data.result.startsWith("Player 2 wins")) {
        if (playerId === 2) {
            userScore++;
        } else {
            opponentScore++;
        }
    }

    // Update the score display
    score.innerHTML = `You: ${userScore} Vs Opponent: ${opponentScore}`;
}

function play(usersChoice) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ player: playerId, choice: usersChoice }));
    } else {
        console.log("WebSocket connection is not open.");
    }
}

// Attach event listeners to buttons
document.getElementById("Rock").addEventListener("click", () => play("Rock"));
document.getElementById("Paper").addEventListener("click", () => play("Paper"));
document.getElementById("Scissors").addEventListener("click", () => play("Scissors"));

// Connect to the server when the page loads
window.onload = connectToServer;
