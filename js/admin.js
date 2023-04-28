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

questionTab.addEventListener('click', function (event) {
  event.preventDefault();

  // make clicked tab active
  questionTab.classList.add('active');
  scoreTab.classList.remove('active');

  // change section shown
  createQuestionSection.style.display = 'block';
  viewScoresSection.style.display = 'none';
});

scoreTab.addEventListener('click', function (event) {
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
  <div id="detail-content">
  <label for="grammar-questions">文法：</label>
  <input type="text" id="grammar-questions" class="number-box" name="grammar-questions" maxlength="3"
    oninput="value = value.replace(/[^0-9]+/i,'');" />
  <span>問</span><br>
  <label for="vocabulary-questions">語彙：</label>
  <input type="text" id="vocabulary-questions" class="number-box" name="vocabulary-questions" maxlength="3"
    oninput="value = value.replace(/[^0-9]+/i,'');" />
  <span>問</span><br>
  <input type="button" id="generate-btn" value="生成"><br>
  </div>
  <div id="generated-questions">
  </div>
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
createTypeSelect.addEventListener('change', function () {
  if (createTypeSelect.value === 'random') {
    createRandomForm();
  } else if (createTypeSelect.value === 'select') {
    createSelectForm();
  }
});

const generate_btn = document.getElementById("generate-btn");
const generated_questions = document.getElementById('generated-questions');
generate_btn.addEventListener('click', function () {

  //examples
//   generated_questions.innerHTML = `
//   <div class="question-container">
//     <div class="question-text">
//     <label for="question-title">問題1</label>
//     <p name="question-title">The new employee was asked to submit the report by the end of the week, but she __________ it by Thursday.</p>
//     </div>
//     <ul class="answer-list">
//     <li class="answer">A) would have completed</li>
//     <li class="answer">B) had completed</li>
//     <li class="answer">C) completed</li>
//     <li class="answer">D) will complete</li>
//     </ul>
//   </div>
//   <div class="question-container">
//     <div class="question-text">  
//     <label for="question-title">問題2</label>
//     <p name="question-title">The CEO's __________ ideas inspired the team to work harder and more creatively.</p>
//     </div>
//     <ul class="answer-list">
//     <li class="answer">選択肢1</li>
//     <li class="answer">選択肢2</li>
//     <li class="answer">選択肢3</li>
//     <li class="answer">選択肢4</li>
//     </ul>
//   </div>
//   <div class="question-container">
//   <div class="question-text">  
//   <label for="question-title">問題1</label>
//   <p name="question-title">The new employee was asked to submit the report by the end of the week, but she __________ it by Thursday.</p>
//   </div>
//   <ul class="answer-list">
//   <li class="answer">選択肢1</li>
//   <li class="answer">選択肢2</li>
//   <li class="answer">選択肢3</li>
//   <li class="answer">選択肢4</li>
//   </ul>
// </div>
//     `;
})
