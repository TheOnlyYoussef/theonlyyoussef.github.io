const tds = document.getElementsByTagName("td");
let coulmn = 0;
let row = 0;
let correctWord = "";
let hint = "";
let dict = "";
let color = "2px solid black";

const modeButton = document.getElementById("dark-btn");

const helpButton = document.getElementById("help-btn");
const helpScreen = document.getElementById("help-screen");

const hintButton = document.getElementById("hint-btn");
const hintScreen = document.getElementById("hint-screen");

const StartOverButton = document.getElementById("startover-btn");




async function getData() {
    StartOverButton.disabled = true;
    StartOverButton.style.cursor = "not-allowed";
    StartOverButton.innerText = "Loading...";
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });

  const data = await res.json();
   dict = data.dictionary;
   StartOverButton.disabled = false;
    StartOverButton.style.cursor = "pointer";
    StartOverButton.innerText = "Start Over";

    return dict;
}

async function main() {
dict = await getData();
startGame(dict);


modeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  is_dark = document.body.classList.contains("dark-mode");
  is_dark ?  color = "2px solid green": color = "2px solid black";
  tds[coulmn + 4*row].style.border =  color;
  is_dark ? modeButton.style.color = "white" : modeButton.style.color = "black";
  is_dark ? helpButton.style.color = "white" : helpButton.style.color = "black";
  is_dark ? hintButton.style.color = "white" : hintButton.style.color = "black";
  modeButton.blur();
});


helpButton.addEventListener("click", () => {
    helpScreen.classList.toggle("hider");
    helpButton.blur();
});


hintButton.addEventListener("click", () => {
    hintScreen.classList.toggle("hider");
    hintButton.blur();
});


StartOverButton.addEventListener("click", () => { 
    resetEverything();
    StartOverButton.blur();
    });


tds[coulmn + 4*row].style.border = color;
document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        if (coulmn < 4){        
            alert("first complete the word");
            return;
        }
        check_word();
        coulmn = 0;
        row += 1;
        tds[coulmn + 4*row].style.border = color;
        return;
    }
    if(event.key === "Backspace" && coulmn > 0) {
        if (coulmn < 4) tds[coulmn + 4*row].style.border = "1px solid  rgb(208, 211, 212)";
        coulmn -= 1;
        tds[coulmn + 4*row].style.border = color;
        tds[coulmn + 4*row].innerText = "";
        return;
    }
    const regex = new RegExp('[a-zA-Z]');
    
    if (coulmn > 3 || !(regex.test(event.key)) || event.key.length > 1) return;
    const keyName = event.key.toUpperCase();
    tds[coulmn + 4*row].innerText = keyName;
    tds[coulmn + 4*row].style.border = "1px solid  rgb(208, 211, 212)";
    coulmn+= 1;
    if (coulmn < 4) tds[coulmn + 4*row].style.border = color;
});
}
  


function check_word() {
    let word = "";
    for (let i = 0; i < 4; i++) {
        cell = tds[i + 4*row];
        letter = cell.innerText;
        word += letter;
        if (correctWord[i] == letter) {
            cell.style.backgroundColor = "green";
            cell.style.color = "white";
        } 
        else if (correctWord.includes(letter)) {
            cell.style.backgroundColor = "#ffffb3";
            cell.style.color = "black";
        } 
        else {
            cell.style.backgroundColor = "grey";
            cell.style.color = "white";
        }

    }
    if (word == correctWord) {
        toggleWinScreen();
    } else if(row == 3) {
        toggleLoseScreen();
    }
}

function toggleLoseScreen(){
    document.getElementById("lose-screen").classList.toggle("hider");
}

function toggleWinScreen(){
    document.getElementById("table").classList.toggle("hider");
    document.getElementById("Win-gif").classList.toggle("hider");
    document.getElementById("win-screen").classList.toggle("hider");

}

function togglHintScreen(){
    document.getElementById("hint-screen").classList.toggle("hider");
}

function resetEverything(){
    document.getElementById("lose-screen").classList.add("hider");
    document.getElementById("win-screen").classList.add("hider");
    document.getElementById("table").classList.remove("hider");
    document.getElementById("Win-gif").classList.add("hider");
    for (let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++){
        cell = tds[j + 4*i];
        cell.style.backgroundColor = "transparent";
        cell.style.border = "1px solid  rgb(208, 211, 212)";
        cell.style.color = "inherit";
        cell.innerText = "";
        }
    }
    coulmn = 0;
    row = 0;
    tds[coulmn + 4*row].style.border = color;
    startGame(dict);

}

function startGame(dictionary){
random = Number.parseInt(Math.random() * dictionary.length);
correctWord = dictionary[random].word.toUpperCase();
hint = dictionary[random].hint;
document.getElementById("lost").innerText = "HAHAHA, You Lost!, The word was: " + correctWord;
document.getElementById("hint").innerText = "Hint: " + hint;
document.getElementById("win").innerText = "Congratulations, You guessed " + correctWord + " right!";
}

main();