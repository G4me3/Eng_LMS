//check value of form
function validateForm() {
    const ID = document.getElementById("ID").value;
    const department = document.getElementById("department").value;
    const undergraduateYear = document.getElementById("undergraduate-year").value;
    const classYear = document.getElementById("class-year").value;
    let password = document.getElementById("password").value;
    var regex = /^[a-zA-Z0-9]{6,}$/; // 英数字6文字以上の正規表現

    if (ID == "") {
        alert("名前を入力してください");
        return false;
    }
    if (department == "") {
        alert("学部を選択してください");
        return false;
    }
    if (undergraduateYear == "") {
        alert("学年を選択してください");
        return false;
    }
    if (classYear == "") {
        alert("授業年度を選択してください");
        return false;
    }
    if (!regex.test(password)) {
        alert("パスワードは英数字6文字以上で入力してください");
        return false;
    }
    return true;
}