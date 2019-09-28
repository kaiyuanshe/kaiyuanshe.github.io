/**
 * Copyright 2011-2013 University of Oxford
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var ONE_STRONG_LICENCES = "q1strong",
  TWO_NO_COPYLEFT = "q2anocopyleft",
  TWO_STRONG_COPYLEFT = "q2bstrong",
  TWO_WEAK_COPYLEFT = "q2bweak",
  TWO_WEAK_MODULE = "q2cmod",
  TWO_WEAK_FILE = "q2cfile",
  TWO_WEAK_LIB = "q2clib",
  THREE_JURISDICTION = "q3juris",
  FOUR_GRANT_PATENTS = "q4apat",
  FOUR_PATENT_RET = "q4bpatret",
  FIVE_ENHANCED_ATTR = "q5enhattr",
  SIX_NO_LOOPHOLE = "q6noloophole",
  SEVEN_NO_PROMO = "q7nopromo";

var DONT_CARE = "careless",
  qs = ["q2a", "q2b", "q2c", "q3", "q4a", "q4b", "q5", "q6", "q7"];

// Different types of questions with different processing consequences
var limitingQs = [ONE_STRONG_LICENCES],
  conditionsReuseQs = [TWO_NO_COPYLEFT, TWO_STRONG_COPYLEFT, TWO_WEAK_COPYLEFT, TWO_WEAK_MODULE, TWO_WEAK_FILE, TWO_WEAK_LIB],
  simpleYesNoQs = [THREE_JURISDICTION, FOUR_GRANT_PATENTS, FOUR_PATENT_RET, FIVE_ENHANCED_ATTR, SIX_NO_LOOPHOLE, SEVEN_NO_PROMO];

var choices = {
    "q1": null,
    "q2a": null,
    "q2b": null,
    "q2c": null,
    "q3": null,
    "q4a": null,
    "q4b": null,
    "q5": null,
    "q6": null,
    "q7": null
  },
  loadedLicenceData, loadedLimitedLicenceData = [], scores = [];

var isInitLicenses = (function () {
  var init = true;

  return {
    get: function () {
      return init;
    },
    done: function () {
      init = false;
    }
  };
})();

function initLicences(allLicences) {
  loadedLicenceData = allLicences;
  initScores(allLicences);
  displayLicences();
}

function initScores(allApplicableLicences) {
  scores = allApplicableLicences.map(function (item) {
    return {
      title: item.title.$value,
      score: -1
    }
  });
}

// FIXME get id from aka not the full licence title
function displayLicences() {
  loadedLicenceData.forEach(calculateScoresForLicence);

  scores.sort(sortScores);

  var score_list = {};

  for (var i = 0; i < scores.length; i++)
    score_list[scores[i].title] = calculateScore(
      loadedLicenceData.find(function (item) {
        return item.title.$value === scores[i].title;
      })
    ).text;

  var list_root = $('#screening-results-inner')[0];

  var license_list = Array.from(list_root.children, function (element) {
    var score = score_list[element.id];

    if (score) {
      $('.rating > strong', element).text(score);
      $(element).show();
    } else
      $(element).hide();

    return [score, element];
  })
    .filter(function (item) { return item[0]; })
    .sort(function (A, B) { return B[0] - A[0]; })
    .map(function (item) { return item[1]; })

  list_root.prepend.apply(list_root, license_list);

  $('#license-tool-result-inner').empty().append(
    $(license_list).clone(false, true).removeClass('folding')
  ).find('.title, .content').unwrap();
}

/*
 * When user clicks a license, toggle it to be expanded or hidden
 */
$('#screening-results-inner').on('click', '.portlet-header', function () {

  var body = this.nextElementSibling;

  body.hidden = !body.hidden;
});

//  Limit to strong communities
// choice licence_value  nrAnswers matches
//   1         1          +1         +1
//   1         -          +1          0
//   0         1 / -      +1         +1
// no choice   1 / -      []

// q2anocopyleft  Include licencing conditions?
//  1          1 (perm.)  +1         0
//  1          -          +1         maybe
//  0          1 (perm.)  +1         +1 (permissive)
//  0          -          +1          0
// careless    1 / -      +1         +1
// no choice   1  / -     -

// q3juris  How would you like your licence to handle the issue of jurisdiction?
//  1 (spec)   1          +1         +1 (dep. on q3specjuris)
//  1          -          +1          0
//  0 (silent) 1          +1          0
//  0          -          +1         +1
// careless    1 / -      +1         +1
// no choice   1  / -     -
// FIXME Don't calculate twice!
function calculateScore(licenceData) {

  var scoreText = 0, nrAnswers = 0, nrMatches = 0;

  qs.forEach(function (item) {
    var fullChoice = choices[item];

    if (!(fullChoice != null)) return;

    var myChoice = fullChoice.split('_')[0];

    if (![-1, 'na'].includes(myChoice)) {
      // choice made
      nrAnswers++;
      nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
    }
  });

  if (isInitLicenses.get())
    scoreText = 100;
  else if (nrAnswers == 0) {
    //scoreText += "No score";
    scoreText += 0;
  } else {
    //scoreText += "<span class= \"nummatches\">" + nrMatches + "</span> out of " + nrAnswers;
    scoreText += parseInt((nrMatches / nrAnswers) * 20) * 5;
  }

  return {
    matches: nrMatches,
    answers: nrAnswers,
    text: scoreText
  };
}

function calculateQuestion(fullChoice, licenceData, nrMatches) {
  fullChoice = fullChoice.split('_');

  if (simpleYesNoQs.includes(fullChoice[0]))
    nrMatches += processSimpleYesNo(fullChoice[0], fullChoice[1], licenceData);
  else if (isLimitingQuestion(fullChoice.join('_')))
    nrMatches += processLimitingQuestion(fullChoice, licenceData);
  else if (conditionsReuseQs.includes(fullChoice[0]))
    nrMatches += processConditionsOnReuseQuestion(fullChoice[0], fullChoice[1], licenceData);

  return nrMatches;
}

// q4apat What is your attitude to the issue of patent grants in relation to your desired licence?
// q4bpatret What is your attitude to patent retaliation in your desired licence?
// q5enhattr Do you want your licence to specify enhanced attribution?
// q6noloophole Do you want your licence to address the 'privacy loophole'?
// q7nopromo Do you want your licence to include such a 'no promotion' feature?
// choice licence_value  nrAnswers matches
//  1          1          +1         +1
//  1          -          +1          0
//  0          1          +1          0
//  0          -          +1         +1
// careless    1 / -      +1         +1
function processSimpleYesNo(simpleQid, choice, licenceData) {
  var newMatch = 0,
    licenceYes = licenceData.content.$value.includes(simpleQid);

  if ((choice == 1 && licenceYes) || (choice == 0 && !licenceYes) || (choice == DONT_CARE))
    newMatch++;

  return newMatch;
}

function processConditionsOnReuseQuestion(simpleQid, choice, licenceData) {
  var newMatch = 0,
    questionMatch = licenceData.content.$value.includes(simpleQid);

  if (choice == 1 && questionMatch) newMatch++;

  // set q2b and q2c to 'not applicable'
  if ((simpleQid == TWO_NO_COPYLEFT) && (choice == 0 && !questionMatch))
    newMatch++;

  return newMatch;
}

function openBox(boxId) {
  //document.getElementById(boxId + '-box').style.display = "block";
  resolver.enabledSteps(qs.indexOf(boxId) + 1, true);
}

function closeBox(boxId) {
  choices[boxId] = null;
  //document.getElementById(boxId).selectedIndex = 0;
  //document.getElementById(boxId + '-box').style.display = "none";
  resolver.enabledSteps(qs.indexOf(boxId) + 1, false);
}

//  Limit to strong communities
// choice licence_value  nrAnswers matches
//   1         1          +1         +1
//   1         -          +1          0
//   0         1 / -      +1         +1
// no choice   1 / -      []
function processLimitingQuestion(fullChoice, licenceData) {
  fullChoice = fullChoice.split('_');

  var newMatch = 0;

  if (fullChoice[1] != 1 || licenceData.content.$value.includes(fullChoice[0]))
    newMatch++;

  return newMatch;
}

function calculateScoresForLicence(licenceData) {

  var nrAnswers = 0, nrMatches = 0, score = -1;

  qs.forEach(function (item) {
    var fullChoice = choices[item];

    if (!(fullChoice != null)) return;

    var myChoice = fullChoice.split('_')[0];

    if (myChoice != -1) {
      // choice made
      nrAnswers++;
      nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
    }
  });

  if (nrAnswers > 0) score = nrMatches / nrAnswers;

  scores.forEach(function (item) {
    if (item.title === licenceData.title.$value)
      item.score = score;
  });
}


function sortScores(a, b) {
  return ((a.score < b.score) ? 1 : ((a.score > b.score) ? -1 :
    ((a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0))
  ));
}

function getLicAttrText(aw1, aw2, aw3, aw4a, aw4b, aw5, aw6, aw7) {
  licenceAttributes = "1. 流行并广泛使用: " + aw1 + "<br />";
  licenceAttributes += "2. 许可协议类型: " + aw2 + "<br />";
  licenceAttributes += "3. 司法管辖区: " + aw3 + "<br />";
  licenceAttributes += "4.a 授予专利权: " + aw4a + "<br />";
  licenceAttributes += "4.b 专利报复条款: " + aw4b + "<br />";
  licenceAttributes += "5. 指定“增强型归属”: " + aw5 + "<br />";
  licenceAttributes += "6. 解决“隐私漏洞”: " + aw6 + "<br />";
  licenceAttributes += "7. 指定“不推广”功能: " + aw7 + "<br />";

  return licenceAttributes;
}

function genLicenceType(licenceData) {
  var licenceType = "";

  if (licenceData == null)
    licenceType = "-";
  else if (licenceData.includes("q2anocopyleft_0"))
    licenceType = "Copyleft";
  else if (licenceData.includes(TWO_NO_COPYLEFT))
    licenceType = "Permissive";
  else if (licenceData.includes(TWO_STRONG_COPYLEFT))
    licenceType = "Strong copyleft";
  else if (licenceData.includes(TWO_WEAK_COPYLEFT))
    licenceType = "Weak copyleft";
  else if (licenceData.includes(TWO_WEAK_MODULE))
    licenceType = "Weak copyleft - Module level";
  else if (licenceData.includes(TWO_WEAK_FILE))
    licenceType = "Weak copyleft - File Level";
  else if (licenceData.includes(TWO_WEAK_LIB))
    licenceType = "Weak copyleft - Library Interface Level";

  return licenceType;
}

function genYesNo(yesNoOption, matchingText) {
  var yesNo = "";

  if (yesNoOption.includes(matchingText))
    yesNo = "Yes";
  else if (yesNoOption == DONT_CARE)
    yesNo = "Don't care";
  else if (yesNoOption == "-" || yesNoOption == "-1")
    yesNo = "-";
  else
    yesNo = "No";

  return yesNo;
}

// after onchange event
function processChoice(formFieldId, fullChoice) {
  choices[formFieldId] = fullChoice;

  if (isLimitingQuestion(fullChoice))
    prepareLicencesList(fullChoice);

  updateForm(fullChoice);
  displayLicences();
  //updateLicenceAnswersSummary();
}

function prepareLicencesList(fullChoice) {
  var choice = fullChoice.split('_')[1];

  if (choice != 1)
    initScores(loadedLicenceData);
  else  // limit list of licences to those matching the req.
    initScores(
      loadedLimitedLicenceData.length ?
        loadedLimitedLicenceData :
        loadedLicenceData.filter(function (item) {
          return 1 == processLimitingQuestion(fullChoice, item)
        })
    );
}

/**
 * Test if the question is a limiting one, ie. if it
 * leads to answering options being removed from the list
 */
function isLimitingQuestion(question) {
  return limitingQs.includes(question.split('_')[0])
}

function updateForm(fullChoice) {
  fullChoice = fullChoice.split('_');

  if (fullChoice[0] == TWO_NO_COPYLEFT) {
    if (fullChoice[1] == 0) {
      openBox('q2b');
      closeBox('q2c');
    } else {
      closeBox('q2b');
      closeBox('q2c');
    }
  } else if (fullChoice[0] == TWO_STRONG_COPYLEFT)
    closeBox('q2c');
  else if (fullChoice[0] == TWO_WEAK_COPYLEFT)
    openBox('q2c');
  else if (fullChoice[0] == FOUR_GRANT_PATENTS)
    if (fullChoice[1] == DONT_CARE || fullChoice[1] == 1)
      openBox('q4b');
    else
      closeBox('q4b');
}

function updateLicenceAnswersSummary() {
  document.getElementById("summary").innerHTML = generateLicenceAnswersSummary();
}

// answers summary
function generateLicenceAnswersSummary() {
  return getLicAttrText(
    awYesNo(choices['q1'], ONE_STRONG_LICENCES),
    genAwLicenceType(choices['q2a'], choices['q2b'], choices['q2c']),
    awYesNo(choices['q3'], THREE_JURISDICTION),
    awYesNo(choices['q4a'], FOUR_GRANT_PATENTS),
    awYesNo(choices['q4b'], FOUR_PATENT_RET),
    awYesNo(choices['q5'], FIVE_ENHANCED_ATTR),
    awYesNo(choices['q6'], SIX_NO_LOOPHOLE),
    awYesNo(choices['q7'], SEVEN_NO_PROMO));
}

function awYesNo(yesNoOption, matchingText) {
  var yesNo = "-";

  if (yesNoOption != null && yesNoOption.includes(matchingText)) {
    yesNoOption = yesNoOption.split('_')

    if (yesNoOption[1] == DONT_CARE)
      yesNo = DONT_CARE;
    else if (yesNoOption[1] == 1)
      yesNo = yesNoOption[0];
    else if (yesNoOption[1] == -1)
      yesNo = "-1";
    else
      yesNo = "";
  }

  return genYesNo(yesNo, matchingText);
}

function genAwLicenceType(aw2a, aw2b, aw2c) {
  var licChoice = null;

  if (aw2c != null && aw2c.includes("q2c"))
    licChoice = aw2c;
  else if (aw2b != null && aw2b.includes("q2b"))
    licChoice = aw2b;
  else if (aw2a != null && aw2a.includes(TWO_NO_COPYLEFT))
    licChoice = aw2a;

  return genLicenceType(licChoice);
}
