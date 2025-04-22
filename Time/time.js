function updateTime() {
    let date2 = new Date()
    document.getElementById("date").innerHTML = date2

    function myDate() {
        let date = new Date()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        if (hours < 10) {
            hours = "0" + hours
        }
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        
        if (hours > 12) {
            hours = hours % 12
        }
        return `${hours}:${minutes}:${seconds}`
    }
    document.getElementById("timer").innerHTML = myDate()
}

setInterval(updateTime, 1000)