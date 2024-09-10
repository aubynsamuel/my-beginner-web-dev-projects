let ws; // WebSocket connection
let playerName; // Store player's name
let userScore = 0;
let opponentScore = 0;
let ipAdress = "192.168.78.146";

const computersOptions = ["Rock", "Paper", "Scissors"];
const computerCDisplay = document.getElementById("Computer");
const userCDisplay = document.getElementById("user");
const resultDisplay = document.getElementById("result");
const score = document.getElementById("scores");
const playAgainDiv = document.getElementById("playAgain");
const nameForm = document.getElementById("nameForm");
const gameArea = document.getElementById("gameArea");
const submitNameBtn = document.getElementById("submitName");

playAgainDiv.style.display = "none"; // Hide "Play Again" by default
gameArea.style.display = "none"; // Hide the game area until the name is submitted

// Function to connect to the WebSocket server
function connectToServer() {
    ws = new WebSocket("ws://"+ ipAdress +":8000"); // Update with your server IP

    ws.onopen = () => {
        console.log("Connected to server");

        // Send the player's name to the server
        ws.send(playerName);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.message) {
            resultDisplay.textContent = data.message;
        } else if (data.gameOver) {
            // Game over logic
            resultDisplay.textContent = data.finalResult;
            playAgainDiv.style.display = "block"; // Show "Play Again" buttons
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
    computerCDisplay.textContent = `Opponent's Choice: ${data.player2Choice}`;
    userCDisplay.textContent = `Your Choice: ${data.player1Choice}`;

    resultDisplay.textContent = data.result;
    userScore = data.scores[playerName];
    opponentScore = data.scores[Object.keys(data.scores).find(name => name !== playerName)];

    score.innerHTML = `${playerName}: ${userScore} Vs ${opponentScore} Opponent`;
}

function play(usersChoice) {
    ws.send(JSON.stringify({ player: playerName, choice: usersChoice }));
}

// Handle name submission
submitNameBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("playerName").value.trim();
    
    if (nameInput) {
        playerName = nameInput; // Store player name
        nameForm.style.display = "none"; // Hide name form
        gameArea.style.display = "block"; // Show game area
        connectToServer(); // Connect to WebSocket server
    } else {
        alert("Please enter your name to start the game.");
    }
});

// Play again or leave the game
yesBtn.addEventListener("click", () => {
    location.href = location.href; // Reload the page to restart the game

});

noBtn.addEventListener("click", () => {
    noBtn.textContent = "Thank you for playing!"; // Customize the "No" action
    ws.close(); // Close the WebSocket connection
});
