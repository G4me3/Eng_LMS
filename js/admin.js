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

// initiallize
questionTab.classList.add('active');
createQuestionSection.style.display = 'block';
viewScoresSection.style.display = 'none';

questionTab.addEventListener('click', function(event) {
  event.preventDefault();

  // make clicked tab active
  questionTab.classList.add('active');
  scoreTab.classList.remove('active');

  // change section shown
  createQuestionSection.style.display = 'block';
  viewScoresSection.style.display = 'none';
});

scoreTab.addEventListener('click', function(event) {
  event.preventDefault();

  // make clicked tab active 
  scoreTab.classList.add('active');
  questionTab.classList.remove('active');

  // change section shown
  viewScoresSection.style.display = 'block';
  createQuestionSection.style.display = 'none';
});

// DOM要素を取得
const createTypeSelect = document.getElementById('create-type');
const formWrapper = document.getElementById('form-wrapper');

// フォーム要素を作成
function createRandomForm() {
  formWrapper.innerHTML = `
    <label for="grammar-questions">文法：</label>
    <input type="number" id="grammar-questions" name="grammar-questions" min="0" max="100" step="1">
    <span>問</span>

    <label for="vocabulary-questions">語彙：</label>
    <input type="number" id="vocabulary-questions" name="vocabulary-questions" min="0" max="100" step="1">
    <span>問</span>

    <button id="generate-btn" type="button">生成</button>
    <button id="submit-btn" type="button">登録</button>
  `;
}

function createSelectForm() {
  formWrapper.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>問題名</th>
          <th>作成日</th>
        </tr>
      </thead>
      <tbody>
        <!-- 表の内容がここに入ります -->
      </tbody>
    </table>
  `;
}

// セレクトボックスが変更されたら対応するフォームを表示
createTypeSelect.addEventListener('change', function() {
  if (createTypeSelect.value === 'random') {
    createRandomForm();
  } else if (createTypeSelect.value === 'select') {
    createSelectForm();
  }
});
