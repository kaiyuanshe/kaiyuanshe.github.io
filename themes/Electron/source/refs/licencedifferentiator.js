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

var ONE_STRONG_LICENCES = "q1strong";
var TWO_NO_COPYLEFT = "q2anocopyleft";
var TWO_STRONG_COPYLEFT = "q2bstrong";
var TWO_WEAK_COPYLEFT = "q2bweak";
var TWO_WEAK_MODULE = "q2cmod";
var TWO_WEAK_FILE = "q2cfile";
var TWO_WEAK_LIB = "q2clib";
var THREE_JURISDICTION = "q3juris";
var FOUR_GRANT_PATENTS = "q4apat";
var FOUR_PATENT_RET = "q4bpatret";
var FIVE_ENHANCED_ATTR = "q5enhattr";
var SIX_NO_LOOPHOLE = "q6noloophole";
var SEVEN_NO_PROMO = "q7nopromo";

var DONT_CARE = "careless";
var qs = ["q2a", "q2b", "q2c", "q3", "q4a", "q4b", "q5", "q6", "q7"];
var queryQuestionIndex = function(val){
    for(var i = 0; i < qs.length; i++){
        if(qs[i] == val)
            return i + 1;
    }

    return -1;
};

// Different types of questions with different processing consequences
var limitingQs = [ ONE_STRONG_LICENCES ];
var conditionsReuseQs = [TWO_NO_COPYLEFT, TWO_STRONG_COPYLEFT, TWO_WEAK_COPYLEFT, TWO_WEAK_MODULE, TWO_WEAK_FILE, TWO_WEAK_LIB];
var simpleYesNoQs = [THREE_JURISDICTION, FOUR_GRANT_PATENTS, FOUR_PATENT_RET, FIVE_ENHANCED_ATTR, SIX_NO_LOOPHOLE, SEVEN_NO_PROMO];

var choices =
		{
			"q1":null,
			"q2a":null,
			"q2b":null,
			"q2c":null,
			"q3":null,
			"q4a":null,
			"q4b":null,
			"q5":null,
			"q6":null,
			"q7":null
		};
var loadedLicenceData;
var loadedLimitedLicenceData = [];
var scores = [];
var isInitLicenses = (function(){
    var
        init = true;

    return {
        get : function(){
            return init;
        },
        done : function(){
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
  scores = [];
  for(i=0;i<allApplicableLicences.length;i++) {
    scores[scores.length] = { "title": allApplicableLicences[i].title.$value, "score" : -1 };
  }
}

// FIXME get id from aka not the full licence title
function displayLicences() {
    licensesHtml = "";
    licensesResultHtml = "";

  for(i=0;i<loadedLicenceData.length;i++) {
    calculateScoresForLicence(loadedLicenceData[i]);
  }
  scores.sort(sortScores);
  for(i=0;i<scores.length;i++) {
      var
          _license = getLicenceForTitle(scores[i].title);
      licensesHtml += generateLicenceHtml(_license);
      licensesResultHtml += generateLicenceResultHtml(_license);
  }
  //document.getElementById("licences_section").innerHTML = licensesHtml;
    document.getElementById('screening-results-inner').innerHTML = licensesHtml || '<p>* 请选择合适的选项以匹配许可证</p>';
    document.getElementById('license-tool-result-inner').innerHTML = licensesResultHtml || '<p>* 请选择合适的选项以匹配许可证</p>';
}

/*
 * Return a license object matching a given title
 */
function getLicenceForTitle(licenceTitle){
    for(var u = 0; u < loadedLicenceData.length; u++) {
    if(loadedLicenceData[u].title.$value == licenceTitle) {
       return loadedLicenceData[u];
    }
  }
}

/*
 * Generate a div for a license
 */
function generateLicenceHtml(licence) {
  html = "";
  
  //
  // Caclulate the score for this license
  //
  var score = calculateScore(licence);

    if(score.text === 0)
        return '';
    //
  // Create a match level from 0 to 5, or "x" if no answers
  // have been set
  //
  if (score.answers == 0 || !score.answers){
    match = "x";
  } else {
      var match = Math.round((Number(score.matches)/Number(score.answers))*10);
      if (match >= 10){
        match = 5;
      } else if (match >=7){
        match = 4;
      } else if (match >=5){
        match = 3;
      } else if (match >=2) {
        match = 2;
      } else if (match >0) {
        match = 1;
      } else {
        match = 0;
      }            
  }


  //
  // Create header 
  //
  var $value = licence.title.$value;
  //header += "<div style=\"width:20%;float:right;text-align:right\">" + score.text + "</div>";
    //header = '<div class="result folding"><div class="title">' + licence.title.$value + ' <span class="rating">评分  ' + score.text + '</span></div></div>';
  var header = '<div class="title" onclick="toggle(this)"><span class="licence-name">' + $value + '</span> <span class="rating">评分  ' + score.text + '</span></div>';
  //
  // Create license attributes
  //
  var attributes =  generateLicenceAttributes(licence.content.$value);

  //
  // Create div
  //
  /*html += "<div onclick=\"toggle(this)\" class=\"portlet score-"+match+" \" id=\"" + licence.title.$value + "\"><div class=\"portlet-header\">";
  html += header + "</div><div class=\"portlet-content\">";
  html += attributes + "</div></div>\n";*/

    html += '<div class="result folding" id="' + $value + '"><div class="portlet-header">';
    html += header + '</div><div class="portlet-content" style="display: none"><div class="content"><span class="licence-name-full"><b>Name: ' + $value + '</b></span><br>';
    html += attributes + "</div></div></div>\n";

  return html;
}

function generateLicenceResultHtml(licence) {
    var
    html = "";

    //
    // Caclulate the score for this license
    //
    var score = calculateScore(licence);

    if(score.text === 0)
        return '';
    //
    // Create a match level from 0 to 5, or "x" if no answers
    // have been set
    //
    if (score.answers == 0 || !score.answers){
        match = "x";
    } else {
        var match = Math.round((Number(score.matches)/Number(score.answers))*10);
        if (match >= 10){
            match = 5;
        } else if (match >=7){
            match = 4;
        } else if (match >=5){
            match = 3;
        } else if (match >=2) {
            match = 2;
        } else if (match >0) {
            match = 1;
        } else {
            match = 0;
        }
    }

    //
    // Create header
    //
    var $value = licence.title.$value;
    //header += "<div style=\"width:20%;float:right;text-align:right\">" + score.text + "</div>";
    //header = '<div class="result folding"><div class="title">' + licence.title.$value + ' <span class="rating">评分  ' + score.text + '</span></div></div>';
    var header = '<div class="title"><span class="licence-name">' + $value + '</span> <span class="rating">评分  ' + score.text + '</span></div>';
    //
    // Create license attributes
    //
    var attributes =  generateLicenceAttributes(licence.content.$value);

    //
    // Create div
    //
    /*html += "<div onclick=\"toggle(this)\" class=\"portlet score-"+match+" \" id=\"" + licence.title.$value + "\"><div class=\"portlet-header\">";
     html += header + "</div><div class=\"portlet-content\">";
     html += attributes + "</div></div>\n";*/

    html += '<div class="result" id="' + $value + '">';
    html += header + '<div class="content"><p><span class="licence-name-full"><b>Name: ' + $value + '</b></span><br>';
    html += attributes + "</p></div></div>\n";

    return html;
}

/*
 * When user clicks a license, toggle it to be expanded or hidden
 */
function toggle(object){
    var content = object.parentNode.parentNode.getElementsByClassName("portlet-content")[0]
    if (content.style.display == "block"){
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

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

  var score = {};

  //scoreText = "[";
  scoreText = 0;
  nrAnswers = 0;
  nrMatches = 0;
 
  for (j=0; j< qs.length; j++) {
    fullChoice = choices[qs[j]];
    if (fullChoice != null) {
	  myChoice = fullChoice.substring(fullChoice.indexOf('_')+1);
	  if (myChoice != -1 && myChoice != "na") {
	    // choice made
		nrAnswers++;
	    nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
	  }
	}
  }

    if(isInitLicenses.get()){
        scoreText = 100;
    } else if (nrAnswers == 0) {
      //scoreText += "No score";
      scoreText += 0;
  } else {
      //scoreText += "<span class= \"nummatches\">" + nrMatches + "</span> out of " + nrAnswers;
      scoreText += parseInt((nrMatches / nrAnswers) * 20) * 5;
  }
  
  //scoreText += "]";
  
  score.matches = nrMatches;
  score.answers = nrAnswers;
  score.text = scoreText;
  
  return score;
  
}

function calculateQuestion(fullChoice, licenceData, nrMatches) {
  delimiterIndex = fullChoice.indexOf('_');
  simpleQid = fullChoice.substring(0, delimiterIndex);
  choice = fullChoice.substring(delimiterIndex + 1);
  if(isSimpleYesNo(simpleQid)) {
	nrMatches = nrMatches + processSimpleYesNo(simpleQid, choice, licenceData);
  } else if (isLimitingQuestion(fullChoice)) {
	nrMatches = nrMatches + processLimitingQuestion(fullChoice, licenceData);
  } else if (isConditionsOnReuseQuestion(simpleQid)) {
    nrMatches = nrMatches + processConditionsOnReuseQuestion(simpleQid, choice, licenceData);
  }
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
    newMatch = 0;
	licenceYes = (licenceData.content.$value.indexOf(simpleQid) > -1);
	if(choice == 1 && licenceYes) {
	  newMatch++;
	} else if (choice == 0 && !licenceYes) {
	  newMatch++;
	} else if (choice == DONT_CARE) {
	  newMatch++;
	}
  
  return newMatch;

}	

function processConditionsOnReuseQuestion(simpleQid, choice, licenceData) {
  newMatch = 0;
  questionMatch = (licenceData.content.$value.indexOf(simpleQid) > -1);

  if(choice == 1 && questionMatch) { 
    newMatch++;
  } 

  if(simpleQid == TWO_NO_COPYLEFT) {
    // set q2b and q2c to 'not applicable'
    if (choice == 0 && !questionMatch) {
      newMatch++;
    }
  }	
  return newMatch;
}

function openBox(boxId) {
  //document.getElementById(boxId + '-box').style.display = "block";
    resolver.enabledSteps(queryQuestionIndex(boxId), true);
}

function closeBox(boxId) {
    choices[boxId] = null;
  //document.getElementById(boxId).selectedIndex = 0;
  //document.getElementById(boxId + '-box').style.display = "none";
    resolver.enabledSteps(queryQuestionIndex(boxId), false);
}

  //  Limit to strong communities
  // choice licence_value  nrAnswers matches
  //   1         1          +1         +1
  //   1         -          +1          0
  //   0         1 / -      +1         +1
  // no choice   1 / -      []
function processLimitingQuestion(fullChoice, licenceData) {
  var newMatch = 0;
  delimiterIndex = fullChoice.indexOf('_');
  simpleQid = fullChoice.substring(0, delimiterIndex);
  choice = fullChoice.substring(delimiterIndex + 1);
  
  limitOK = (licenceData.content.$value.indexOf(simpleQid) > -1);
  if (!(choice == 1 && !limitOK)) {
    newMatch++;
  }
  return newMatch;
}	

function calculateScoresForLicence(licenceData) {
  nrAnswers = 0;
  nrMatches = 0;
  score = -1;
 
  for (j=0; j< qs.length; j++) {
    fullChoice = choices[qs[j]];
    if (fullChoice != null) {
	  myChoice = fullChoice.substring(fullChoice.indexOf('_')+1);
	  if (myChoice != -1) {
	    // choice made
		nrAnswers++;
	    nrMatches = calculateQuestion(fullChoice, licenceData, nrMatches);
	  }
	}
  }
  
  if (nrAnswers > 0) {
	score = (nrMatches / nrAnswers);
  }
  
  // FIXME Must be easier way
  for (t=0; t<scores.length; t++) {
    if(scores[t].title == licenceData.title.$value) {
      scores[t].score = score;
	}
  }
}


function sortScores(a,b) { 
  return ((a.score < b.score) ? 1 : ((a.score > b.score) ? -1 : 
    ((a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0))
  ));
}

function generateLicenceAttributes(licenceData) {
  return getLicAttrText(
	genYesNo(licenceData, ONE_STRONG_LICENCES), 
	genLicenceType(licenceData),
    genJurisdiction(licenceData), 
	genYesNo(licenceData, FOUR_GRANT_PATENTS), 
	genYesNo(licenceData, FOUR_PATENT_RET),
	genYesNo(licenceData, FIVE_ENHANCED_ATTR), 
	genYesNo(licenceData, SIX_NO_LOOPHOLE), 
	genYesNo(licenceData, SEVEN_NO_PROMO)
  );
}

function getLicAttrText(aw1, aw2, aw3, aw4a, aw4b, aw5, aw6, aw7) {
    licenceAttributes = "1. 流行并广泛使用: " + aw1 + "<br />";
    licenceAttributes += "2. 许可协议类型: "  + aw2 + "<br />";
    licenceAttributes += "3. 司法管辖区: "  + aw3 + "<br />";
    licenceAttributes += "4.a 授予专利权: "  + aw4a + "<br />";
    licenceAttributes += "4.b 专利报复条款: "  + aw4b + "<br />";
    licenceAttributes += "5. 指定“增强型归属”: "  + aw5 + "<br />";
    licenceAttributes += "6. 解决“隐私漏洞”: "  + aw6 + "<br />";
    licenceAttributes += "7. 指定“不推广”功能: "  + aw7 + "<br />";
  
  return licenceAttributes;
 }

function genLicenceType(licenceData) {
    licenceType = "";

  if (licenceData == null) {
    licenceType = "-";
  } else if (licenceData.indexOf("q2anocopyleft_0") > -1) {
    licenceType = "Copyleft";
  } else if (licenceData.indexOf(TWO_NO_COPYLEFT) > -1) {
    licenceType = "Permissive";
  } else if (licenceData.indexOf(TWO_STRONG_COPYLEFT) > -1) {
    licenceType = "Strong copyleft";
  } else if (licenceData.indexOf(TWO_WEAK_COPYLEFT) > -1) {
    licenceType = "Weak copyleft";
  } else if (licenceData.indexOf(TWO_WEAK_MODULE) > -1) {
    licenceType = "Weak copyleft - Module level";
  } else if (licenceData.indexOf(TWO_WEAK_FILE) > -1) {
    licenceType = "Weak copyleft - File Level";
  } else if (licenceData.indexOf(TWO_WEAK_LIB) > -1) {
    licenceType = "Weak copyleft - Library Interface Level";
  }
  return licenceType;
}
 
function genJurisdiction(licenceData) {
  jurisdiction = "";
	
  if (licenceData == null) {
    jurisdiction = "-";
  } else if (licenceData.indexOf(THREE_JURISDICTION) > -1) { 
    jurisdiction  = "Specified";
    q3specjuris = "q3specjuris";
    startJuris = licenceData.indexOf(q3specjuris);
    if (startJuris > -1) {
      jurisToEnd = licenceData.substring(startJuris + q3specjuris.length);
      jurisdiction += jurisToEnd.substring(0,jurisToEnd.indexOf(", q")) ;
    }
  } else {
    jurisdiction = "Not specified";
  }
 
  return jurisdiction;
}
 
function genYesNo(yesNoOption, matchingText) {
  yesNo = "";
  if(yesNoOption.indexOf(matchingText) > -1 ) {
    yesNo = "Yes";   
  } else if (yesNoOption == DONT_CARE) {
    yesNo = "Don't care";
  } else if (yesNoOption == "-" || yesNoOption == "-1") {
    yesNo = "-";
  } else {
    yesNo = "No";
  }
  return yesNo;
}

// after onchange event
function processChoice(formFieldId, fullChoice) {
  choices[formFieldId] = fullChoice;
  if (isLimitingQuestion(fullChoice)) {
    prepareLicencesList(fullChoice);
  }
  updateForm(fullChoice);
  displayLicences();
  //updateLicenceAnswersSummary();
} 

function prepareLicencesList(fullChoice) {
  delimiterIndex = fullChoice.indexOf('_');
  simpleQid = fullChoice.substring(0, delimiterIndex);
  choice = fullChoice.substring(delimiterIndex + 1);

  if (choice == 1) {
    // limit list of licences to those matching the req.
    if (loadedLimitedLicenceData.length == 0) {
      for(i=0;i<loadedLicenceData.length;i++) {
	    match = processLimitingQuestion(fullChoice, loadedLicenceData[i]);
        if(match == 1) {
		  loadedLimitedLicenceData[loadedLimitedLicenceData.length] = 
		    loadedLicenceData[i];
		}
      }	
    }	
    initScores(loadedLimitedLicenceData);
  } else {
    initScores(loadedLicenceData);
  }
} 

function isSimpleYesNo(question) {
  yesNo = false;
  for(k = 0; k < simpleYesNoQs.length; k++) {
    if(simpleYesNoQs[k] == question) {
	  yesNo = true;
	  break;
	}
  }
  return yesNo;
}

/**
 * Test if the question is a limiting one, ie. if it
 * leads to answering options being removed from the list
 */
function isLimitingQuestion(question) {
  limiting = false;
  
  if(question.indexOf('_') > -1) {
    delimiterIndex = question.indexOf('_');
    question = question.substring(0, delimiterIndex);
  }
  
  for(k = 0; k < limitingQs.length; k++) {
    if(limitingQs[k] == question) {
	  limiting = true;
	  break;
	}
  }
  return limiting;
}

function isConditionsOnReuseQuestion(question) {
  conditionsReuse = false;
  for(k = 0; k < conditionsReuseQs.length; k++) {
    if(conditionsReuseQs[k] == question) {
	  conditionsReuse = true;
	  break;
	}
  }
  return conditionsReuse;
}

function updateForm(fullChoice) {
  delimiterIndex = fullChoice.indexOf('_');
  choiceId = fullChoice.substring(0, delimiterIndex);
  choiceNr = fullChoice.substring(delimiterIndex + 1);
  
  if(choiceId == TWO_NO_COPYLEFT) {
    if (choiceNr == 0) {
      openBox('q2b');
	  closeBox('q2c');
    } else {
      closeBox('q2b');
	  closeBox('q2c');
	}
  } else if (choiceId == TWO_STRONG_COPYLEFT) {
    closeBox('q2c');
  } else if (choiceId == TWO_WEAK_COPYLEFT) {
    openBox('q2c');
  } else if (choiceId == FOUR_GRANT_PATENTS) {
    if (choiceNr == DONT_CARE || choiceNr == 1) {
      openBox('q4b');
    } else {
      closeBox('q4b');
	}
  }
}

/*function updateLicenceAnswersSummary(){
    //document.getElementById("summary").innerHTML = generateLicenceAnswersSummary();
}*/
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
   yesNo = "-";

   if(yesNoOption != null && yesNoOption.indexOf(matchingText) > -1) {
     delimiterIndex = yesNoOption.indexOf('_');
     simpleQid = yesNoOption.substring(0, delimiterIndex);
     choice = yesNoOption.substring(delimiterIndex + 1);
     if (choice == DONT_CARE){
       yesNo = DONT_CARE;
     } else if(choice == 1) {
       yesNo = simpleQid;   
     } else if(choice == -1) {
	   yesNo = "-1";
	 } else {
	   yesNo = "";
	 }
   }

   return genYesNo(yesNo, matchingText);
 }

function genAwLicenceType(aw2a, aw2b, aw2c) {
  licChoice = null;
  if(aw2c != null && aw2c.indexOf("q2c") > -1) {
    licChoice = aw2c;
  } else if (aw2b != null && aw2b.indexOf("q2b") > -1) {
    licChoice = aw2b;
  } else if(aw2a != null && aw2a.indexOf(TWO_NO_COPYLEFT) > -1) {
    licChoice = aw2a;
  }
   
  return genLicenceType(licChoice);
}
 

