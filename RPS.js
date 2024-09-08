let computerCDisplay = document.getElementById("opponent");
let userCDisplay = document.getElementById("user");
let resultDisplay = document.getElementById("result");
let finalResult = document.getElementById("finalResult");

let userChoice = "";
let ws = new WebSocket("ws://localhost:8765");

ws.onmessage = (message) => {
    let data = message.data;
    
    if (data.includes("Opponent's move")) {
        let opponentMove = data.split(": ")[1];
        computerCDisplay.textContent = "Opponent's Choice: " + opponentMove;
        determineWinner(userChoice, opponentMove);
    } else if (data.includes("Your move")) {
        userCDisplay.textContent = "Your Choice: " + userChoice;
    } else {
        resultDisplay.textContent = data;
    }
};

document.getElementById("Rock").addEventListener("click", () => sendChoice("Rock"));
document.getElementById("Paper").addEventListener("click", () => sendChoice("Paper"));
document.getElementById("Scissors").addEventListener("click", () => sendChoice("Scissors"));

function sendChoice(choice) {
    userChoice = choice;
    ws.send(choice);
}

function determineWinner(usersChoice, opponentsChoice) {
    if (usersChoice == opponentsChoice) {
        finalResult.textContent = "That's a tie!";
    } else if (
        (usersChoice == "Rock" && opponentsChoice == "Scissors") ||
        (usersChoice == "Paper" && opponentsChoice == "Rock") ||
        (usersChoice == "Scissors" && opponentsChoice == "Paper")
    ) {
        finalResult.textContent = "You Win!";
    } else {
        finalResult.textContent = "Opponent Wins!";
    }
}
