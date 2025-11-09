import { saveScoreToSupabase } from "./backend.js";
import { saveSessionResult } from "./backend.js";

const sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
let scoreBefore = 0;       // stays 0 until you add real scoring later
let scoreAfter = 0;

async function saveSession() {
  // const row = {
  //   session_id: sessionId,
  //   score_before: scoreBefore,
  //   levels_completed: levelsCompleted,
  //   timestamp: new Date().toISOString()
  // };
  await saveSessionResult(scoreBefore,scoreAfter);   // writes to DB
}

  
  /* Check solutions pre-quiz*/
  // function checkSolutions() {
  //   window.scrollTo({
  //       top: 0, // Scrolls to the top of the page
  //       behavior: 'smooth' // Provides a smooth scrolling animation
  //   });
  //   continueButton.classList.remove('hidden');
  //   getAnswersButton.classList.add('hidden');
  // }

  async function checkSolutions() {
  // normalize
  const normalizeRegex = (r) => r.replaceAll("+", "|");

  let score = 0;

  // 10 questions
  for (let j = 0; j < 10; j++) {
    // 1) get regex displayed in question
    const qEl = document.getElementById(`question${j}`);
    if (!qEl) continue;
    // remove number
    let r = qEl.textContent.trim().replace(/^\d+\.\s*/, "");
    r = normalizeRegex(r);

    // 2) option chosen
    let selected = -1;
    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`q${j}a${i}`);
      if (optEl.classList.contains('selected')) {
        selected = i;
        break;
      }
    }
    if (selected === -1) continue; //0 for no selection

    const correctIndices = [];
    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`q${j}a${i}`);
      let s = optEl.textContent.replace(/^[A-D]\)\s*/, '').trim();
      if (s === 'λ') s = ''; // empty string
      if (match(s, r)) correctIndices.push(i);
    }

    if (correctIndices.includes(selected)) score += 1;
  }

  scoreBefore = score;

  // if (typeof saveSession === "function") {
  //   await saveSession(); 
  // }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  const continueButton = document.getElementById('continueToGameBtn');
  const getAnswersButton = document.getElementById('checkAnswersBtn');
  continueButton.classList.remove('hidden');
  getAnswersButton.classList.add('hidden');
}


async function checkSolutionsPost() {
  // normalize
  const normalizeRegex = (r) => r.replaceAll("+", "|");

  let score = 0;

  // 10 questions
  for (let j = 0; j < 10; j++) {
    // 1) get regex displayed in question
    const qEl = document.getElementById(`question${j}`);
    if (!qEl) continue;
    // remove number
    let r = qEl.textContent.trim().replace(/^\d+\.\s*/, "");
    r = normalizeRegex(r);

    // 2) option chosen
    let selected = -1;
    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`q${j}a${i}`);
      if (optEl.classList.contains('selected')) {
        selected = i;
        break;
      }
    }
    if (selected === -1) continue; //0 for no selection

    const correctIndices = [];
    for (let i = 0; i < 4; i++) {
      const optEl = document.getElementById(`q${j}a${i}`);
      let s = optEl.textContent.replace(/^[A-D]\)\s*/, '').trim();
      if (s === 'λ') s = ''; // empty string
      if (match(s, r)) correctIndices.push(i);
    }

    if (correctIndices.includes(selected)) score += 1;
  }

  scoreAfter = score;
      
  if (typeof saveScoreToSupabase === "function") {
    await saveScoreToSupabase(scoreBefore, scoreAfter);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  const continueButton = document.getElementById('continueToGameBtn');
  const getAnswersButton = document.getElementById('checkAnswersBtn');
  continueButton.classList.remove('hidden');
  getAnswersButton.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
  const privacyButton = document.getElementById('privacyButton');
  const infoWindow = document.getElementById('infoWindow');
  const closeButton = document.getElementById('closeButton');
  const continueButton = document.getElementById('continueToGameBtn');
  const finishButton = document.getElementById('finishGameBtn');
  const getAnswersButton = document.getElementById('checkAnswersBtn');
  const getSubmitButton = document.getElementById('submitAnswersBtn');


  // NEW: these match your HTML structure
  const quizSection  = document.querySelector('.quiz-section');
  const contentCard  = document.querySelector('.content-card');

  function showInfoWindow() { infoWindow.classList.remove('hidden'); }
  function hideInfoWindow() { infoWindow.classList.add('hidden'); }

  privacyButton.addEventListener('click', showInfoWindow);
  closeButton.addEventListener('click', hideInfoWindow);

  // Already defined elsewhere: checkSolutions() computes scoreBefore and reveals Continue
  getAnswersButton.addEventListener('click', checkSolutions);
  getSubmitButton.addEventListener('click', checkSolutionsPost);

  // NEW: what Continue should do in “pre-quiz only” mode
  continueButton.addEventListener('click', () => {
    // hide the quiz block
    quizSection?.classList.add('hidden');

  // show a simple completion screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});




  // getAnswersButton.addEventListener('click', checkSolutions);

  // /* Show answers postquiz */
  // function checkSolutionsPost() {
  //   window.scrollTo({
  //       top: 0, // Scrolls to the top of the page
  //       behavior: 'smooth' // Provides a smooth scrolling animation
  //   });
  //   getSubmitButton.classList.add('hidden');
  // }

    

/* Generate random regex, with probability of generating single character w
For use only as a recursive helper function in generateRegex()*/
function weighted_regex_gen(w) {
  if (Math.random() > w) { // return single character at random
    const possibilities = ["0","1"];
    return [possibilities[Math.floor(Math.random()*2)], 0];
  }
  const choice = Math.floor(Math.random()*100);
  if (choice < 15) { // 15% chance of (a|b)
    var [a, x] = weighted_regex_gen(w*w);
    var [b, y] = weighted_regex_gen(w*w);
    if (a==b) {
      return [a,x];
    }
    if (x == 2) {
      a = "(" + a + ")";
    }
    if (y == 2) {
      b = "(" + b + ")";
    }
    return ["("+a + "|" + b+")", 1];
  } else if (choice < 85) { // 70% chance of ab
    var [a,x] = weighted_regex_gen(w*w);
    var [b,y] = weighted_regex_gen(w*w);
    return [a+b,2];
  } else { // 15% chance of a*
    const [a,x] = weighted_regex_gen(w*w);
    if (a.length == 1) {
      return [a + "*",3];
    }
    if (x == 3) {
      return [a,3]; // may want to remove this, depending on whether or not we want repeated stars
    }
    return ["(" + a + ")*",3];
  }
}

/* Generate a random regular expression */
function generateRegex() {
  return weighted_regex_gen(0.97)[0];
}

/* turn screen-readable regex into parseable regex */
function display_to_regex(r) {
  return r.replaceAll("+","|");
}

function regex_to_display(r) {
  return r.replaceAll("|","+")
}

/* Check if string s is a match for regex r*/
function match(s, r) {
  var re;
  try {
    re = new RegExp("^(" + r + ")$");
  } catch (e) {
    return false;
  }
  const result = re.test(s);
  return result;
}

function genExample(r) {
  if (r.length <= 1) {
    return r; // single character or empty, it's got to be 0 or 1 or ''
  }
  var depth = 0;
  var pos = [];
  for (var i = 0; i < r.length; i++) {
    if (r[i] == "(") {
      depth += 1;
    } else if (r[i] == ")") {
      depth -= 1;
    } else if (r[i] == "|" && depth == 0) {
    pos.push(i);
    }
  }
  if (pos.length > 0) { // or without parentheses around it
    pos.unshift(-1);
    pos.push(r.length);
    var which = Math.floor(Math.random()*(pos.length-1));
    return genExample(r.slice(pos[which]+1,pos[which+1]));
  }


  if (r[0] != "(" && r[1] != "*") {
    return r[0] + genExample(r.slice(1)); // first character is not in an or, and not kleene starred, so it must be just a 0 or 1 at the start of the string
  } 
  if (r[0] != "(" && r.length == 2) {
    return r[0].repeat(Math.floor(Math.random()*4)); // first character is single character with kleene star
  }
  if (r[0] != "(") {
    return r[0].repeat(Math.floor(Math.random()*4)) + genExample(r.slice(2)); // first character is single character with kleene star
  }
  var depth = 0; // first character is (, so let's find the matching )
  var pos = 0;
  var join = 0;
  do { 
    if (r[pos] == "(") {
      depth += 1;
    } else if (r[pos] == ")") {
      depth -= 1;
    } else if (depth == 1 && r[pos] == "|") {
      join = pos;
    }
    pos += 1;
  } while (pos < r.length && depth > 0);
  if (pos == r.length && join != 0) { // whole thing is one big or
    if (Math.random() > 0.5) {
      return genExample(r.slice(1,join)); // first option
    } else {
      return genExample(r.slice(join+1,pos-1)); // second option
    }
  }
  if (pos == r.length) { // we have (r), we can just strip the outer parentheses
    return genExample(r.slice(1,pos-1));
  }
  if (r[pos] != "*") { // first bit is an or
    if (Math.random() > 0.5) {
      return genExample(r.slice(1,join)) + genExample(r.slice(pos)); // first option plus whatever comes next
    } else {
      return genExample(r.slice(join+1,pos-1)) + genExample(r.slice(pos)); // second option plus whatever comes next
    }
  }
  if (r[pos] == "*") {
    const its = Math.floor(Math.random()*4);
    var out = "";
    for (var i=0; i < its; i++) {
      out = out + genExample(r.slice(1,pos-1)); // random number of examples of what's in the star
    }
    return out + genExample(r.slice(pos+1));
  }
  return '';
}

/* randomly change a string some number of times */
function perturbString(s, n) {
  if (n == 0) {
    return s // base case
  }
  if (s.length == 0) {
    return perturbString(String(Math.floor(Math.random()*2)),n-1); // only option is add a random character
  }
  var opt = Math.random()*3;
  if (opt > 2) { // insert random character somewhere
    const ind = Math.floor(Math.random()*(s.length+1));
    return perturbString(s.slice(0,ind) + String(Math.floor(Math.random()*2)) + s.slice(ind),n-1);
  }
  if (opt > 1) { // delete random character
    const ind = Math.floor(Math.random()*s.length);
    return perturbString(s.slice(0,ind) + s.slice(ind+1), n-1);
  }
  const ind = Math.floor(Math.random()*s.length); // change random character
  return perturbString(s.slice(0,ind) + String(1-Number(s[ind])) + s.slice(ind+1),n-1);
}

/* given a regex, an array of accept strings and an array of reject strings, return a string (in neither the accept nor reject arrays) and a bool that indicates whether the regex should accept it or not */
function genNewExample(r, accept, reject) {
  var s;
  do {
    s = genExample(r);
    if (Math.random() > 0.5) {
      s = perturbString(s,1);
    }
  } while (accept.includes(s) || reject.includes(s));
  return [s, !match(s,r)];
}

function beginQuiz(qid) {
    for (var j = 0; j<10; j++) {
      var r = generateRegex();
      document.getElementById(qid+'question'+String(j)).innerHTML = String(j+1)+". " + regex_to_display(r);
      var s = [];
      const labels = ["A","B","C","D"];
      const correct = Math.floor(Math.random()*4);
      for (var i = 0; i < 4; i++) {
        var s0 = genExample(r);
        if (i != correct) {
          do {
            s0 = perturbString(s0,1);
          } while (!match(s0,r));
        }
        if (s0 == '') {
          s0 = 'λ';
        }
        document.getElementById(qid + 'q'+j+'a'+String(i)).innerHTML = labels[i] + ") " + s0;
        s.push(s0);
      }
    }

    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < 4; i++) {
        const opt = document.getElementById(`${qid}q${j}a${i}`);
        opt.addEventListener('click', () => {
          // selection
          for (let k = 0; k < 4; k++) {
            document.getElementById(`${qid}q${j}a${k}`).classList.remove('selected');
          }
          opt.classList.add('selected');
        });
      }
    }

    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });

    const quiz0 = document.getElementById('quiz'+qid);
    const landingSection = document.getElementById('landingSection');
    quiz0.classList.remove("hidden");
}

// handles begin event 
document.getElementById('beginBtn').addEventListener('click', function() {
    beginQuiz('0');
    landingSection.classList.add("hidden")
});

// handles checkAnswer event 
document.getElementById('checkAnswersBtn').addEventListener('click', function() {
    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
});

// handles continue (toGame) event 
document.getElementById('continueToGameBtn').addEventListener('click', function() {
  const quiz0 = document.getElementById('quiz0');
  quiz0.classList.add('hidden');

  const gameSection = document.getElementById('gameSection');
  gameSection.classList.remove('hidden');
  initializeGame();
});

// handles finish game event
document.getElementById('finishGameBtn').addEventListener('click', function(){
  const gameSection = document.getElementById('gameSection');
  gameSection.classList.add('hidden');
  beginQuiz('1');
});

/* Password game stuff */
var include_strs = [];
var exclude_strs = [];
var usr_regex = '';

function initializeGame() {
  include_strs = [];
  exclude_strs = [];
  
  const include_html = document.getElementById('include-list');
  const exclude_html = document.getElementById('exclude-list');
  include_html.innerHTML = "";
  exclude_html.innerHTML = "";

  document.getElementById("user-regex").innerHTML = "";

  usr_regex = '';
  for (var i = 0; i < 1; i++) {
    var cand = '';
    do {
      cand = '';
      for (var k=0; k<10; k++) {
        cand += '01'.charAt(Math.floor(Math.random() * 2));
      }
    } while (include_strs.includes(cand) || exclude_strs.includes(cand));
    include_strs.push(cand);
    
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(cand+" (⨉)"));
    include_html.appendChild(entry);

    cand = '';
    do {
      cand = '';
      for (var k=0; k<10; k++) {
        cand += '01'.charAt(Math.floor(Math.random() * 2));
      }
    } while (include_strs.includes(cand) || exclude_strs.includes(cand));
    exclude_strs.push(cand);

    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(cand+" (✓)"));
    exclude_html.appendChild(entry);
  }
}

document.getElementById("user-regex").addEventListener('input', function (evt) {
  const r = display_to_regex(this.value);
  
  const include_html = document.getElementById('include-list');
  const exclude_html = document.getElementById('exclude-list');
  include_html.innerHTML = "";
  exclude_html.innerHTML = "";
  
  var all_met = true;

  for (var i = 0; i < include_strs.length; i++) {
    s = include_strs[i]
    matches = match(s,r);

    if (matches) {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(s+" (✓)"));
      include_html.appendChild(entry);
    } else {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(s+" (⨉)"));
      include_html.appendChild(entry);
      all_met = false;
    }
  }

  for (var i = 0; i < exclude_strs.length; i++) {
    s = exclude_strs[i];
    matches = match(s,r);

    if (!matches) {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(s+" (✓)"));
      exclude_html.appendChild(entry);
    } else {
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(s+" (⨉)"));
      exclude_html.appendChild(entry);
      all_met = false;
    }
  }

  if (all_met) {
    var [c,b] = genNewExample(r,include_strs,exclude_strs);
    if (b) {
      include_strs.push(c);
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(c+" (⨉)"));
      include_html.appendChild(entry);
    } else {
      exclude_strs.push(c);
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(c+" (⨉)"));
      exclude_html.appendChild(entry);
    }
  }

});
