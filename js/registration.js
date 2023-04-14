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

//when user clicked regist btn
document.getElementById("register-form").addEventListener("submit", function (e) {
    if (validateForm(e)) {
        registUserInformation(e);
    }
});

// //check value of form
function validateForm(event) {
    const ID = document.getElementById("id").value;
    const department = document.getElementById("department").value;
    const undergraduateYear = document.getElementById("undergraduate-year").value;
    const classType = document.getElementById("class-type").value;
    const password = document.getElementById("password").value;

    var regex = /^[a-zA-Z0-9]{6,}$/; // 英数字6文字以上の正規表現

    if (ID == "") {
        alert("IDを入力してください");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }

    if (department == "-- 選択してください --") {
        alert("所属学部を選択してください");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    if (undergraduateYear == "-- 選択してください --") {
        alert("学年を選択してください");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    if (classType == "-- 選択してください --") {
        alert("クラスを選択してください");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    if (!regex.test(password)) {
        alert("パスワードは英数字6文字以上で入力してください");
        event.stopPropagation();
        event.preventDefault();
        return false;
    }
    return true;
}

//send POST request to GAS and regist user information to Google SpreadSheet
//userInformationArray[ID,department,undergraduate-year,class-year,class-type,password]
function registUserInformation(event) {
    event.stopPropagation();
    event.preventDefault();
    const ID = document.getElementById("id").value;
    const department = document.getElementById("department").value;
    const undergraduateYear = document.getElementById("undergraduate-year").value;
    const classYear = new Date().getFullYear();
    const classType = document.getElementById("class-type").value;
    const password = document.getElementById("password").value;
    const userInformationArray = [ID, department, undergraduateYear, classYear, classType, password];

    console.log(classYear);
    const URL = 'https://script.google.com/macros/s/AKfycbygMkwZCa-6mJ7uU5AROMwA-SZ_Px5jqRyOqDehW0a3qeqNdEsseADX9FY7tTihue0d/exec';
    const sendData = {
        "ID": userInformationArray[0],
        "pass": userInformationArray[5],
        "学部": userInformationArray[1],
        "学年": userInformationArray[2],
        "授業年度": userInformationArray[3],
        "class": userInformationArray[4]
    };

    var postparam =
    {
        "method": "POST",
        "mode": "no-cors",
        "Content-Type": "application/x-www-form-urlencoded",
        "body": JSON.stringify(sendData),
    };

    fetch(URL, postparam).then(() => {
        alert(`ユーザー登録が完了しました\nID : [${sendData.ID}]\npass : [${sendData.pass}]\n忘れずにメモしてください `)
        location.href = "./login.html";
    });

}