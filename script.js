
document.addEventListener('DOMContentLoaded', function() {
  const privacyButton = document.getElementById('privacyButton');
  const infoWindow = document.getElementById('infoWindow');
  const closeButton = document.getElementById('closeButton');
  const continueButton = document.getElementById('continueToGameBtn');
  const getAnswersButton = document.getElementById('checkAnswersBtn');

  // handles privacy policy popup window
  function showInfoWindow() {
    infoWindow.classList.remove('hidden');
  } 

  function hideInfoWindow() {
    infoWindow.classList.add('hidden');
  }

  privacyButton.addEventListener('click', showInfoWindow);

  closeButton.addEventListener('click', hideInfoWindow);

  
  /* Check solutions*/
  function checkSolutions() {
    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
    continueButton.classList.remove('hidden');
    getAnswersButton.classList.add('hidden');
  }

  getAnswersButton.addEventListener('click', checkSolutions);

});

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

/* Check if string s is a match for regex r*/
function match(s, r) {
  const re = new RegExp("^(" + r + ")$");
  const result = re.test(s);
  return result;
}

function genExample(r) {
  if (r.length <= 1) {
    return r; // single character or empty, it's got to be 0 or 1 or ''
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
  do {
    var s = genExample(r);
    if (Math.random() > 0.5) {
      s = perturbString(s,1);
    }
  } while (!accept.includes(s) && !reject.includes(s));
  return [s, !match(s,r)];
}

// handles begin event 
document.getElementById('beginBtn').addEventListener('click', function() {
    for (var j = 0; j<10; j++) {
      var r = generateRegex()
      document.getElementById('question'+String(j)).innerHTML = String(j+1)+". " + r;
      var s = [];
      const labels = ["A","B","C","D"];
      for (var i = 0; i < 4; i++) {
        var s0 = genExample(r);
        if (Math.random()>0.5) {
          s0 = perturbString(s0,1);
        }
        if (s0 == '') {
          s0 = 'λ';
        }
        document.getElementById('q'+j+'a'+String(i)).innerHTML = labels[i] + ") " + s0
        s.push(s0)
      }
    }

    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
});

// handles checkAnswer event 
document.getElementById('checkAnswersBtn').addEventListener('click', function() {
    const continueButton = document.getElementById('continueToGameBtn');
    const getAnswersButton = document.getElementById('checkAnswersBtn');
    


    window.scrollTo({
        top: 0, // Scrolls to the top of the page
        behavior: 'smooth' // Provides a smooth scrolling animation
    });
});
