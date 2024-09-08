let ws; // WebSocket connection
let playerId; // Will be 1 or 2
let userScore = 0;
let opponentScore = 0;

const computersOptions = ["Rock", "Paper", "Scissors"];
const computerCDisplay = document.getElementById("Computer");
const userCDisplay = document.getElementById("user");
const resultDisplay = document.getElementById("result");
const score = document.getElementById("scores");
const playAgainDiv = document.getElementById("playAgain");
const yesBtn = document.getElementById("yesBt");
const noBtn = document.getElementById("noBt");

// Function to connect to the WebSocket server
function connectToServer() {
    ws = new WebSocket("ws://localhost:8000"); // Replace with your server address if needed

    ws.onopen = () => {
        console.log("Connected to server");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.message) {
            resultDisplay.textContent = data.message;
            if (data.message === "Game starting...") {
                playerId = data.player; // Assign player ID
            }
        } else {
            // Game data received
            handleGameData(data);
        }
    };

    ws.onclose = () => {
        console.log("Disconnected from server");
        // Handle disconnection (e.g., show a message)
    };
}

function handleGameData(data) {
    computerCDisplay.textContent = `Opponent's Choice: ${data.player2Choice}`; // Assuming player 2 is the opponent
    userCDisplay.textContent = `Your Choice: ${data.player1Choice}`; // Assuming player 1 is the user

    resultDisplay.textContent = data.result;

    // Update scores (you'll need to adjust logic based on player IDs)
    if (data.result.startsWith("Player 1")) {
        userScore++;
    } else if (data.result.startsWith("Player 2")) {
        opponentScore++;
    }
    score.innerHTML = `You ${userScore} Vs ${opponentScore} Opponent`;

    // ... (rest of your game logic, like checking for a win)
}

function play(usersChoice) {
    ws.send(JSON.stringify({ player: playerId, choice: usersChoice }));
}

// ... (rest of your JavaScript code)

// Connect to the server when the page loads
window.onload = connectToServer;
