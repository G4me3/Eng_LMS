//2023/05/04

// if login is not authenticated, back to login page
// that means it doesn't allow direct access except for onself
const cookie = document.cookie;
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

let questionnaire_names;
async function getJson() {
    const getURL = "https://script.google.com/macros/s/AKfycbz6sLn0QwU5fyTSUgF71VzvcWlS8pge7fb8nVDf-19JvBPQ8w6uGEkrh1jMjgoet1Vw/exec";
    try {
        const response = await fetch(getURL);
        const data = await response.json();
        questionnaire_names = data;
    } catch (error) {
        console.error(error);
    };
}

function startLoading() {
    document.getElementById("loader").style.display = "block";
}

function endLoading() {
    document.getElementById("loader").style.display = "none";
}

window.onload = async function () {
    startLoading();
    const score_table=document.getElementById("score-table");
    score_table.style.display="none";
    const table_body = document.getElementById("table-body");
    await getJson();
    for (questionnaire_name of questionnaire_names) {
        table_body.innerHTML += `
        <tr>
            <td><a href="./answer.html?ID=${getParam("ID", "")}&type=${questionnaire_name}">${questionnaire_name}</a></td>
            <td><a href="">結果</a></td>
        </tr>
        `;
    }
    endLoading();
    score_table.style.display="block";
}
