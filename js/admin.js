
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

const createTypeSelect = document.getElementById('create-type');
const formWrapper = document.getElementById('form-wrapper');

// make form 
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
    <label for="total_quantity">合計：</label>
    <p id="total_quantity" name="total_quantity">0</p>
    <span>問</span><br>
    <input type="button" id="generate-btn" value="生成" onclick="generateEvent()"><br>
    </div>
    <div id="generated-questions">
    </div>
  `;

  // show total quantity of selected
  const number_box = document.querySelectorAll(".number-box");
  const grammar_quantity = document.getElementById("grammar-questions");
  const vocabulary_quantity = document.getElementById("vocabulary-questions");
  number_box.forEach(element => {
    element.addEventListener("input", function () {
      const total_quantity = document.getElementById("total_quantity");
      total_quantity.innerHTML = `${parseInt(grammar_quantity.value || 0) + parseInt(vocabulary_quantity.value || 0)} `;
    })
  })
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

// show forms depends on <select> value 
createTypeSelect.addEventListener('change', function () {
  if (createTypeSelect.value === 'random') {
    createRandomForm();
  } else if (createTypeSelect.value === 'select') {
    createSelectForm();
  }
});

// show total quantity of selected
const number_box = document.querySelectorAll(".number-box");
const grammar_quantity = document.getElementById("grammar-questions");
const vocabulary_quantity = document.getElementById("vocabulary-questions");
number_box.forEach(element => {
  element.addEventListener("input", function () {
    const total_quantity = document.getElementById("total_quantity");
    total_quantity.innerHTML = `${parseInt(grammar_quantity.value || 0) + parseInt(vocabulary_quantity.value || 0)} `;
  })
})

// get Json from Google SpreadSheet
let grammar_list = {};
let vacabulary_list = {};
async function getDataFromSpreadSheet() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzSFIvoRCY4yokWGYO0zApavcOP_4fo0A5XFhOuUWkfZ9Nu43gZmjkyMAenquKBfev8ng/exec');
    const data = await response.json();
    grammar_list = data.Sheet1;
    vocabulary_list = data.Sheet2;
  } catch (error) {
    console.error(error);
  }
}

// check input quantity is valid or not 
function checkNumberValidation(grammar_quantity, vocabulary_quantity) {
  if (parseInt(grammar_quantity) > grammar_list.length) {
    alert(`登録されている問題数をオーバーしています\n
    あなたの指定した数：${grammar_quantity}\n
    登録されている文法問題：${grammar_list.length}`);
    return false;
  }
  if (parseInt(vocabulary_quantity) > vocabulary_list.length) {
    alert(`登録されている問題数をオーバーしています\n
    あなたの指定した数：${vocabulary_quantity}\n
    登録されている語彙問題：${vocabulary_list.length}`);
    return false;
  }
  if(parseInt(grammar_quantity)+parseInt(vocabulary_quantity)==0){
    alert(`一問も選択されていません`);
    return false;
  }

  return true;
}

// push questions picked random to array "selected_questions" and return that
function generateQuestionRandomly(type, quantity, selected_questions) {
  if (type == "grammar") {
    for (let i = 0; i < quantity; i++) {
      let randomInteger = Math.floor(Math.random() * (grammar_list.length));
      selected_questions.push(grammar_list[randomInteger]);
      grammar_list.splice(randomInteger, 1);
    }
  } else if (type == "vocabulary") {
    for (let i = 0; i < quantity; i++) {
      let randomInteger = Math.floor(Math.random() * (vocabulary_list.length));
      selected_questions.push(vocabulary_list[randomInteger]);
      vocabulary_list.splice(randomInteger, 1);
    }
  }
  return selected_questions;
}

// shuffle elements of array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// モーダルウィンドウを開く
function showDetermineNameForm() {
  document.getElementById("myModal").style.display = "block";
}

// モーダルウィンドウを閉じる
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

function registQuestionnaire() {
  const questionnaire_name = document.getElementById("questionnaire-name").value || "";
  if(questionnaire_name=="")alert("空白では登録できません");

  //GETで問題集のスプレッドシートから全シート名を取得して
  //名前がかぶってたら警告を出す

  //POSTでデータをGASに渡して登録
  //終わったメッセージを出す
}

let selected_questions = [];
// manager of generating questions 
async function generateEvent() {
  await getDataFromSpreadSheet();
  const grammar_quantity = document.getElementById("grammar-questions").value || 0;
  const vocabulary_quantity = document.getElementById("vocabulary-questions").value || 0;
  if (!checkNumberValidation(grammar_quantity, vocabulary_quantity)) return false;
  
  selected_questions = [];
  selected_questions = generateQuestionRandomly("grammar", grammar_quantity, selected_questions); //add grammar
  selected_questions = generateQuestionRandomly("vocabulary", vocabulary_quantity, selected_questions);//add vocabulary
  selected_questions = shuffleArray(selected_questions);

  const generated_questions = document.getElementById('generated-questions');
  generated_questions.innerHTML = "";
  for (selected in selected_questions) {
    generated_questions.innerHTML += `
     <div class="question-container">
      <div class="question-text">
       <label for="question-title">問題${parseInt(selected) + 1}(${selected_questions[selected].category})</label>
       <p name="question-title">${selected_questions[selected].問題文}</p>
      </div>
      <ul class="choice-list">
      <label for="choice1">A) ：</label>
      <li class="choice" name="choice1">${selected_questions[selected].選択肢1}</li><br>
      <label for="choice2">B) ：</label>
      <li class="choice" name="choice2">${selected_questions[selected].選択肢2}</li><br>
      <label for="choice3">C) ：</label>
      <li class="choice" name="choice3">${selected_questions[selected].選択肢3}</li><br>
      <label for="choice4">D) ：</label>
      <li class="choice" name="choice4">${selected_questions[selected].選択肢4}</li><br>
      <label for="answer">正解：</label>
      <li class="answer" name="answer">${selected_questions[selected].正答}</li>
      </ul>
     </div>
       `;
  }
  generated_questions.innerHTML += `<input type="button" id="submit-btn" value="登録" onclick="showDetermineNameForm()">`;
}


