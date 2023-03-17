let jsonArray;
async function getJson() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwCdosPs3w2ieCN2r7IOIC30oKslgnvOhP5mIOih0YRYPJtr3UHjUv-fPRuoaHcru32/exec');
    const data = await res.json();
    return data;
}

let IDAndPassList = {};
getJson().then(data => {
    jsonArray = data;
    for (let index in jsonArray[0]) {
        IDAndPassList[jsonArray[0][index]["ID"]] = jsonArray[0][index]["pass"];
    }
}).catch(err => {
    console.log(err);
})

//show password when「パスワードを表示」clicked
const showPasswordCheckbox = document.getElementById("show-password");
showPasswordCheckbox.addEventListener("change", function () {
    const passwordInput = document.getElementById("password");
    if (showPasswordCheckbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});

//Even Litener of form submit
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
    const id = document.getElementById("id").value;
    const pass = document.getElementById("password").value;
    if (checkParam(id, pass, event)) {
        checkIDAndPass(id, pass, event);
    };
})

//check parameter when「Login」clicked(submit form) 
function checkParam(id, pass, event) {
    if (id.value == "" && pass.value == "") {
        alert("IDが入力されていません \n Passwordが入力されていません")
        event.stopPropagation();
        event.preventDefault();
        return false;
    } else if (id.value == "") {
        alert("IDが入力されていません");
        event.stopPropagation();
        event.preventDefault();
        return false;
    } else if (pass.value == "") {
        alert("Passwordが入力されていません");
        event.stopPropagation();
        event.preventDefault();
        return false;
    } else {
        return true;
    }
}

//check ID and Password are correct 
function checkIDAndPass(id, pass, event) {
    const keys = Object.keys(IDAndPassList);
    if (keys.includes(id)) {
        if (IDAndPassList[id] == pass) {
            event.stopPropagation();
            event.preventDefault();
            window.location.href = `./top.html?ID=${id}&auth=true`;
        } else {
            alert("IDまたはPasswordが間違っています");
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    } else {
        alert("IDまたはPasswordが間違っています");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
}