let seconds = 0
let minutes = 0
let hours = 0
let millisecond = 0

function time() {
    millisecond += 1
    if (millisecond < 10) {
        document.getElementById("Millisecond").textContent = "0" + millisecond
    } else { document.getElementById("Millisecond").textContent = millisecond }

    //Convert milliseconds to seconds
    if (millisecond == 99) {
        millisecond = 0
        seconds += 1

        if (seconds < 10) {
            document.getElementById("Seconds").textContent = "0" + seconds + ":"
        } else { document.getElementById("Seconds").textContent = seconds + ":" }

    }

    //Convert seconds to minutes
    if (seconds == 59) {
        seconds = 0
        minutes += 1

        if (minutes < 10) {
            document.getElementById("Minutes").textContent = "0" + minutes + ":"
        } else { document.getElementById("Minutes").textContent = minutes + ":" }

    }

    //Convert Minutes to Hours
    if (minutes == 59) {
        minutes = 0
        hours += 1

        if (hours < 10) {
            document.getElementById("Hours").textContent = "0" + hours + ":"
        } else { document.getElementById("Hours").textContent = hours + ":" }
    }
}


let startContinue = document.getElementById("Start")
let stopT = document.getElementById("Stop")
let reset = document.getElementById("Reset")
let continueT = document.getElementById("Continue")
let lapButton = document.getElementById("lapBtn")
let lapDisplay = document.getElementById("lapDisplay")
let intervalID

console.log(intervalID)
startContinue.addEventListener("click", () => {
    if (!intervalID) {
        intervalID = setInterval(time, 10)
    }
})

lapButton.addEventListener("click", () => {
    const paddedHours = (hours < 10) ? `0${hours}` : hours;
    const paddedMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    const paddedSeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const paddedMillisecond = (millisecond < 10) ? `0${millisecond}` : millisecond;

    lapDisplay.textContent = `Lap: ${paddedHours} : ${paddedMinutes} : ${paddedSeconds} : ${paddedMillisecond}`;
})

stopT.addEventListener("click", () => {
    clearInterval(intervalID)
    intervalID = null
})

reset.addEventListener("click", () => {
    location.href = location.href;
})
