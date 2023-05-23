// if login is not authenticated, back to login page
// that means it doesn't allow direct access except for onself
const sessionStorageValue = sessionStorage.getItem("message");
if (sessionStorageValue != getParam("ID", "") + " is authenticated") {
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

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// make first tab active
tabs[0].classList.add('active');
tabContents[0].classList.add('active');

// process about when tab clicked
tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    const activeTab = document.querySelector('.tab.active');
    const activeContent = document.querySelector('.tab-content.active');
    let clickedTab = e.target.parentNode;
    if (clickedTab.tagName.toLowerCase() === "a") clickedTab = clickedTab.parentNode;
    const targetContent = document.querySelector(`#${clickedTab.dataset.tab}`);

    // switch avtive and non active elements
    activeTab.classList.remove('active');
    clickedTab.classList.add('active');
    activeContent.classList.remove('active');
    targetContent.classList.add('active');
  });
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
    <input type="button" id="generate-btn" value="生成" onclick="generateRandom()"><br>
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

// get number of checkbox checked and show that
function showCheckedNum() {
  let checkedNumber = 0;
  const select_check = document.querySelectorAll("input[type=checkbox]");
  select_check.forEach((element) => {
    if (element.checked) {
      checkedNumber++;
    }
  });
  const total_quantity = document.getElementById("total_quantity");
  total_quantity.textContent = `${checkedNumber}`;
}

function showCheckedQuestionsListModal() {
  document.getElementById("list-modal").style.display = "block";
}

function closeCheckedQuestionsListModal() {
  document.getElementById("list-modal").style.display = "none";
}

function showCheckedQuestions() {
  const select_check = document.querySelectorAll("input[type=checkbox]");
  const checkedValues = []
  select_check.forEach(element => {
    if (element.checked) {
      checkedValues.push(element.value);
    }
  })
  let list_modal_content = document.getElementById("list-modal-content");
  list_modal_content.innerHTML = ``;
  let count = 0;
  for (value of checkedValues) {
    console.log(value);
    if (value.charAt(0) === "g") {
      let questionID=value.substring(1);
      value = value.substring(1);
      value = parseInt(value) - 1;
      list_modal_content.innerHTML += `
      <div class="question-container">
        <div class="question-text">
          <label for="question-title">問題${++count}(${grammar_list[value].category}-${questionID})</label>
          <p name="question-title">${grammar_list[value].問題文}</p>
        </div>
        <ul class="choice-list">
          <label for="choice1">A) ：</label>
          <li class="choice" name="choice1">${grammar_list[value].選択肢1}</li><br>
          <label for="choice2">B) ：</label>
          <li class="choice" name="choice2">${grammar_list[value].選択肢2}</li><br>
          <label for="choice3">C) ：</label>
          <li class="choice" name="choice3">${grammar_list[value].選択肢3}</li><br>
          <label for="choice4">D) ：</label>
          <li class="choice" name="choice4">${grammar_list[value].選択肢4}</li><br>
          <label for="answer">正解：</label>
          <li class="answer" name="answer">${grammar_list[value].正答}</li>
        </ul>
     </div>`;
    }
    else if (value.charAt(0) === "v") {
      let questionID=value.substring(1);
      value = value.substring(1);
      value = parseInt(value) - 1;
      list_modal_content.innerHTML += `
      <div class="question-container">
        <div class="question-text">
          <label for="question-title">問題${++count}(${vocabulary_list[value].category}-${questionID})</label>
          <p name="question-title">${vocabulary_list[value].問題文}</p>
        </div>
        <ul class="choice-list">
          <label for="choice1">A) ：</label>
          <li class="choice" name="choice1">${vocabulary_list[value].選択肢1}</li><br>
          <label for="choice2">B) ：</label>
          <li class="choice" name="choice2">${vocabulary_list[value].選択肢2}</li><br>
          <label for="choice3">C) ：</label>
          <li class="choice" name="choice3">${vocabulary_list[value].選択肢3}</li><br>
          <label for="choice4">D) ：</label>
          <li class="choice" name="choice4">${vocabulary_list[value].選択肢4}</li><br>
          <label for="answer">正解：</label>
          <li class="answer" name="answer">${vocabulary_list[value].正答}</li>
        </ul>
     </div>`;
    }

  }
  showCheckedQuestionsListModal();
}

async function createSelectForm() {
  document.getElementById("generated-questions").style.display="none";
  await getDataFromSpreadSheet();
  document.getElementById("generated-questions").style.display="block";
  formWrapper.innerHTML = `        
  <div id="detail-content">
    <label for="show-option">表示：</label>
    <select id="show-option" name="show-option">
      <option value="all">すべて</option>
      <option value="grammar">文法</option>
      <option value="vocabulary">語彙</option>
      </select><br>
    <label for="total_quantity">選択中：</label>
    <p id="total_quantity" name="total_quantity">0</p>
    <span>問</span><br>
    <p id="show-checked-questions" class="show-checked-questions">選択した問題を見る</p>
    <input type="button" id="generate-btn" value="登録" onclick="showDetermineNameForm()"><br>
  </div>
  <div id="generated-questions">
  <div id="grammar-list"></div>
  <div id="vocabulary-list"></div>
  </div>
    `;

  const grammar_area = document.getElementById("grammar-list");
  for (grammar_list_num in grammar_list) {
    grammar_area.innerHTML += `
    <div class="question-container">
      <div class="question-text">
      <input class="select-check" type="checkbox" value="g${parseInt(grammar_list_num) + 1}"/>
        <label for="question-title">文法-${parseInt(grammar_list_num) + 1}</label>
        <p name="question-title">${grammar_list[grammar_list_num].問題文}</p>
        </div>
        <ul class="choice-list">
        <label for="choice1">A) ：</label>
        <li class="choice" name="choice1">${grammar_list[grammar_list_num].選択肢1}</li><br>
        <label for="choice2">B) ：</label>
        <li class="choice" name="choice2">${grammar_list[grammar_list_num].選択肢2}</li><br>
        <label for="choice3">C) ：</label>
        <li class="choice" name="choice3">${grammar_list[grammar_list_num].選択肢3}</li><br>
        <label for="choice4">D) ：</label>
        <li class="choice" name="choice4">${grammar_list[grammar_list_num].選択肢4}</li><br>
        <label for="answer">正解：</label>
        <li class="answer" name="answer">${grammar_list[grammar_list_num].正答}</li>
      </ul>
   </div>
   `;
  }
  const vocabulary_area = document.getElementById("vocabulary-list");
  for (vocabulary_list_num in vocabulary_list) {
    vocabulary_area.innerHTML += `
    <div class="question-container">
    <div class="question-text">
    <input class="select-check" type="checkbox" value="v${parseInt(vocabulary_list_num) + 1}"/>
    <label for="question-title">語彙-${parseInt(vocabulary_list_num) + 1}</label>
    <p name="question-title">${vocabulary_list[vocabulary_list_num].問題文}</p>
    </div>
    <ul class="choice-list">
    <label for="choice1">A) ：</label>
    <li class="choice" name="choice1">${vocabulary_list[vocabulary_list_num].選択肢1}</li><br>
    <label for="choice2">B) ：</label>
    <li class="choice" name="choice2">${vocabulary_list[vocabulary_list_num].選択肢2}</li><br>
    <label for="choice3">C) ：</label>
    <li class="choice" name="choice3">${vocabulary_list[vocabulary_list_num].選択肢3}</li><br>
    <label for="choice4">D) ：</label>
    <li class="choice" name="choice4">${vocabulary_list[vocabulary_list_num].選択肢4}</li><br>
    <label for="answer">正解：</label>
    <li class="answer" name="answer">${vocabulary_list[vocabulary_list_num].正答}</li>
      </ul>
      </div>
      `;
  }

  // show forms depends on <select> value 
  const show_option = document.getElementById("show-option");
  show_option.addEventListener('change', function () {
    if (show_option.value === "all") {
      document.getElementById("grammar-list").style.display = "block";
      document.getElementById("vocabulary-list").style.display = "block";
    } else if (show_option.value === 'grammar') {
      document.getElementById("grammar-list").style.display = "block";
      document.getElementById("vocabulary-list").style.display = "none";
    } else if (show_option.value === 'vocabulary') {
      document.getElementById("grammar-list").style.display = "none";
      document.getElementById("vocabulary-list").style.display = "block";
    }
  });

  const select_check = document.querySelectorAll("input[type=checkbox]");
  select_check.forEach(element => {
    element.addEventListener("change", function () {
      showCheckedNum();
    });
  })

  const show_checked_questions = document.getElementById("show-checked-questions");
  show_checked_questions.addEventListener("click", function () {
    showCheckedQuestions();
  })

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

function startLoading() {
  document.getElementById("loader").style.display = "block";
}

function endLoading() {
  document.getElementById("loader").style.display = "none";
}

// get Json from Google SpreadSheet
let grammar_list = {};
let vocabulary_list = {};
async function getDataFromSpreadSheet() {
  startLoading();
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzSFIvoRCY4yokWGYO0zApavcOP_4fo0A5XFhOuUWkfZ9Nu43gZmjkyMAenquKBfev8ng/exec');
    const data = await response.json();
    grammar_list = data.Sheet1;
    vocabulary_list = data.Sheet2;
  } catch (error) {
    console.error(error);
  }
  endLoading();
}

///////////////////↓ create questionnaire ↓//////////////////////

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
  if (parseInt(grammar_quantity) + parseInt(vocabulary_quantity) == 0) {
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

// open modal window
function showDetermineNameForm() {
  document.getElementById("form-modal").style.display = "block";
}

// close modal window
function closeDetermineNameForm() {
  document.getElementById("form-modal").style.display = "none";
}

let sheet_names = [];
async function registQuestionnaire() {
  closeDetermineNameForm();
  const question_container = document.getElementById("generated-questions");
  question_container.style.display = "none";
  startLoading();
  const questionnaire_name = document.getElementById("questionnaire-name").value || "";
  if (questionnaire_name == "") alert("空白では登録できません");

  //GET all sheet names from SpreadSheet and check not to create sheet with the same name
  const getURL = "https://script.google.com/macros/s/AKfycbz6sLn0QwU5fyTSUgF71VzvcWlS8pge7fb8nVDf-19JvBPQ8w6uGEkrh1jMjgoet1Vw/exec";
  if (sheet_names.length == 0) {
    try {
      const response = await fetch(getURL);
      const data = await response.json();
      sheet_names = data;
    } catch (error) {
      console.error(error);
    };
  }
  for (let sheet_num in sheet_names) {
    if (sheet_names[sheet_num] == questionnaire_name) {
      alert("その名前は既に使用されています");
      endLoading();
      question_container.style.display = "block";
      return false;
    }
  }

  // POST request
  // regist questionnaire to SpreadSheet
  const postURL = "https://script.google.com/macros/s/AKfycbxsqym2SlFsbf-7lkTEKY6E_MJmQxD7S34ss-NP48jh0FHtkcmJGihHJ2z3WBwPw5Zr/exec";
  let sendData = [];
  sendData.push(questionnaire_name);
  for (let selected_question in selected_questions) {
    sendData.push(selected_questions[selected_question]);
  }

  const postparam = {
    "method": "POST",
    "mode": "no-cors",
    "Content-Type": "application/x-www-form-urlencoded",
    "body": JSON.stringify(sendData),
  };

  fetch(postURL, postparam).then(() => {
    alert("登録が完了しました");
    location.reload();
  });
}

let selected_questions = [];
// manager of generating questions 
async function generateRandom() {
  if (Object.keys(grammar_list).length == 0) await getDataFromSpreadSheet();
  const grammar_quantity = document.getElementById("grammar-questions").value || 0;
  const vocabulary_quantity = document.getElementById("vocabulary-questions").value || 0;
  if (!checkNumberValidation(grammar_quantity, vocabulary_quantity)) return false;

  selected_questions = [];
  selected_questions = generateQuestionRandomly("grammar", grammar_quantity, selected_questions); //add grammar
  selected_questions = generateQuestionRandomly("vocabulary", vocabulary_quantity, selected_questions);//add vocabulary
  selected_questions = shuffleArray(selected_questions);
  console.log(selected_questions);

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

///////////////////↑ create questionnaire  ↑//////////////////////
