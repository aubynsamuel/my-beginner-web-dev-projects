let plength
let characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+?/ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
let password = ""
let index

let Password = () => {
    for (let i = 0; i < plength; i++) {
        index = Math.floor(Math.random() * (characters.length))
        password += characters.charAt(index)
    }
    return password
}

document.getElementById("generate").onclick = function () {
    password = ""

    if (document.getElementById("passwordLength").value == false) {
        window.alert("Enter your prefered password length to generate password")
        document.getElementById("generate").innerHTML = "Generate"
    } else {
        document.getElementById("generate").innerHTML = "Regenerate"
    }

    plength = document.getElementById("passwordLength").value
    document.getElementById("password").innerText = `Password: ${Password()}`

}
document.getElementById("copy").onclick = function () {
    var copytext = document.getElementById("password")
    var textarea = document.createElement("textarea")
    textarea.value = password
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
    alert("Password Copied: " + password)

}




