//2023/03/17

// if login is not authenticated, back to login page
// that means it doesn't allow direct access except for onself
const cookie = document.cookie;
console.log(cookie);
if (cookie != getParam("ID", "") + " is authenticated") {
    window.location.href = "login.html";
}

//get parameter from URL
function getParam(name, url) {
    if (url == "") url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

document.getElementById("welcome-msg").innerHTML =
    `ユーザー： ${getParam("ID", "")} さん`;
