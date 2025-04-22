let computersOptions = ["Rock", "Paper", "Scissors"];
let computerCDisplay = document.getElementById("Computer");
let userCDisplay = document.getElementById("user");
let resultDisplay = document.getElementById("result");
let userScore = 0
let ComputerScore = 0
let score = document.getElementById("scores")
document.getElementById("playAgain").style.display = "none"

function determineWinner(usersChoice, computersChoice) {
    if (usersChoice == computersChoice) {
        return "Tie, Try Again";
    } else if (
        (usersChoice == "Rock" && computersChoice == "Scissors") ||
        (usersChoice == "Paper" && computersChoice == "Rock") ||
        (usersChoice == "Scissors" && computersChoice == "Paper")
    ) {
        userScore += 1
        return "You Win";
    } else {  
        ComputerScore += 1
        return "Computer Wins";
    }
}

function play(usersChoice) {
    if ((ComputerScore != 4) && (userScore != 4)) {
        let index = Math.floor(Math.random() * 3);
        let computersChoice = computersOptions[index];

        computerCDisplay.textContent = "Computer's Choice: " + computersChoice;
        userCDisplay.textContent = "Your Choice: " + usersChoice;

        let result = determineWinner(usersChoice, computersChoice);
        resultDisplay.textContent = result;

        score.innerHTML = `Computer ${ComputerScore} Vs ${userScore} You`
        if (ComputerScore == 4) {
            document.getElementById("finalResult").innerHTML = `End of Game, Computer Won <br>`
        }
        else if (userScore == 4) {
            document.getElementById("finalResult").innerHTML = `End of Game, You Won 🎇 <br>`
        }
    }

    yes = document.getElementById("yesBt")
    no = document.getElementById("noBt")
    if ((ComputerScore == 4) || (userScore == 4)) {
        document.getElementById("playAgain").style.display = "block"
        yes.addEventListener("click", () => location.href = location.href)
        no.addEventListener("click", () => no.textContent = "GoodBye See You Again Next Time")
    }
}

document.getElementById("Rock").addEventListener("click", () => play("Rock"));
document.getElementById("Paper").addEventListener("click", () => play("Paper"));
document.getElementById("Scissors").addEventListener("click", () => play("Scissors"));
