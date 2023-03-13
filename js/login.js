
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
    const id = document.getElementById("id");
    const pass = document.getElementById("password");
    if (checkParam(id, pass, event)) {
        if (checkIDAndPass(id, pass, event)) {

        }
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
    
}