// get Json from Google SpreadSheet
async function getJson() {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwCdosPs3w2ieCN2r7IOIC30oKslgnvOhP5mIOih0YRYPJtr3UHjUv-fPRuoaHcru32/exec');
    const data = await res.json();
    return data;
}

// Create ID and password list from Json data
const adminList=[];
async function createIDAndPassList() {
    const data = await getJson();
    const jsonArray = data[0];
    const IDAndPassList = {};
    jsonArray.forEach(item => {
        IDAndPassList[item.ID] = item.pass;
        if(item.authority=="administrator"){
            adminList.push(item.ID);
        }
    });
    return IDAndPassList;
}

// Event to show password 
const showPasswordCheckbox = document.getElementById("show-password");
const passwordInput = document.getElementById("password");
showPasswordCheckbox.addEventListener("change", function () {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
});

// check user is admin or not and move page depends on the result
function checkAuthority(loginID){
    adminList.forEach(admin=>{
        if(admin==loginID){
            document.cookie = `${loginID} is authenticated and admin`;
            window.location.href=`./admin.html?ID=${loginID}&auth=true`;
        }else{
            document.cookie = `${loginID} is authenticated`;
            window.location.href = `./top.html?ID=${loginID}&auth=true`;
        }
    })
}

// Event to login form
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const idInput = document.getElementById("id");
    const passInput = document.getElementById("password");
    const id = idInput.value;
    const pass = passInput.value;
    if (!checkParam(id, pass)) {
        return;
    }
    const IDAndPassList = await createIDAndPassList();
    if (!checkIDAndPass(IDAndPassList, id, pass)) {
        return;
    }
    checkAuthority(id);
});

// check parameter
function checkParam(id, pass) {
    if (id === "" && pass === "") {
        alert("IDが入力されていません \n Passwordが入力されていません")
        return false;
    } else if (id === "") {
        alert("IDが入力されていません");
        return false;
    } else if (pass === "") {
        alert("Passwordが入力されていません");
        return false;
    } else {
        return true;
    }
}

// check ID and Password
function checkIDAndPass(IDAndPassList, id, pass) {
    if (!IDAndPassList.hasOwnProperty(id) || IDAndPassList[id] !== pass) {
        alert("IDまたはPasswordが間違っています");
        return false;
    }
    return true;
}
