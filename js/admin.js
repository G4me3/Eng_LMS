// if login is not authenticated, back to login page
// that means it doesn't allow direct access except for onself
const cookie = document.cookie;
if (cookie != getParam("ID", "") + " is authenticated and admin") {
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

const questionTab = document.querySelector('#questionTab');
const scoreTab = document.querySelector('#scoreTab');
const createQuestionSection = document.querySelector('#create-question');
const viewScoresSection = document.querySelector('#view-scores');

// 初期表示の設定
questionTab.classList.add('active');
createQuestionSection.style.display = 'block';
viewScoresSection.style.display = 'none';

questionTab.addEventListener('click', function(event) {
  event.preventDefault();

  // クリックされたタブをアクティブにする
  questionTab.classList.add('active');
  scoreTab.classList.remove('active');

  // 表示するセクションを切り替える
  createQuestionSection.style.display = 'block';
  viewScoresSection.style.display = 'none';
});

scoreTab.addEventListener('click', function(event) {
  event.preventDefault();

  // クリックされたタブをアクティブにする
  scoreTab.classList.add('active');
  questionTab.classList.remove('active');

  // 表示するセクションを切り替える
  viewScoresSection.style.display = 'block';
  createQuestionSection.style.display = 'none';
});