// Justin


// gegooide stenen array
let punten = [];

function veranderfoto() 
{
    for (let i = 0; i < 5; i++) {
        if (punten[i] == 1) { document.getElementById(i.toString()).src = "images/dice_1.jpg"; } 
        if (punten[i] == 2) { document.getElementById(i.toString()).src = "images/dice_2.jpg"; } 
        if (punten[i] == 3) { document.getElementById(i.toString()).src = "images/dice_3.jpg"; } 
        if (punten[i] == 4) { document.getElementById(i.toString()).src = "images/dice_4.jpg"; } 
        if (punten[i] == 5) { document.getElementById(i.toString()).src = "images/dice_5.jpg"; }  
    }
}

let een = 0;
let twee = 0;
let drie = 0;
let vier = 0;
let vijf = 0;

// totaal aantal ogen gegooit
let totaal = 0;

// hoevaak nog worpen
let worpenover = 3;

// staat ... vast?
let steen1vast = false;
let steen2vast = false;
let steen3vast = false;
let steen4vast = false;
let steen5vast = false;


// kijkt hoeveel keer welke ogen zijn gegooit
function count() {
    punten.forEach(element => {
        if (element == 1) {
            een++;
        }
        if (element == 2) {
            twee++;
        }
        if (element == 3) {
            drie++;
        }
        if (element == 4) {
            vier++;
        }
        if (element == 5) {
            vijf++;
        }
    });
}
// hold functie
function hold(h) 
{
    h = true 
}
// alles gooien
function gooien() { 
    if (worpenover > 0) {
        if (steen1vast == false) {
            punten[0] = dobbelsteen();
        }
        if (steen2vast == false) {
            punten[1] = dobbelsteen();
        }
        if (steen3vast == false) {
            punten[2] = dobbelsteen();
        }
        if (steen4vast == false) {
            punten[3] = dobbelsteen();
        }
        if (steen5vast == false) {
            punten[4] = dobbelsteen();
        }
        count();

        totaal = een + twee + drie + vier + vijf;
    
 //       steen1vast = false;
 //       steen2vast = false;
 //       steen3vast = false;
 //       steen4vast = false;
 //       steen5vast = false;

        worpenover--;
        document.getElementById("worpen").innerHTML = worpenover.toString();
        veranderfoto();
        if (worpenover == 1) {
        document.getElementById("gooi").innerHTML = "reset spel";

    } else if (worpenover == 0) {
        reset();
    }
}
}

// reset het hele spel
function reset() {
    punten[0] = 0;
    punten[1] = 0;
    punten[2] = 0;
    punten[3] = 0;
    punten[4] = 0;
    een = 0;
    twee = 0;
    drie = 0;
    vier = 0;
    vijf = 0;
    totaal = 0;
    worpenover = 3;

    steen1vast = false;
    steen2vast = false;
    steen3vast = false;
    steen4vast = false;
    steen5vast = false;
    veranderfoto();
    document.getElementById("gooi").innerHTML = "Click here to roll the dice";
    document.getElementById("worpen").innerHTML = worpenover.toString();
}

document.write("<p> je hebt dit gegooit: " +
    punten[0] + ", " +
    punten[1] + ", " +
    punten[2] + ", " +
    punten[3] + ", " +
    punten[4])

document.write("<br><p>Dat is: <br>" +
    een + " keer een 1<br>" +
    twee + " keer een 2<br>" +
    drie + " keer een 3<br>" +
    vier + " keer een 4<br>" +
    vijf + " keer een 5<br>")

// random getal tussen 1 en 6
function dobbelsteen() {
    return Math.floor(Math.random() * 5) + 1;
}

function calcYahtzee() {
    let found = false;
    for (let i=1; i<7; i++) {
        if (this.punten[i] == 5) {
            found = true;
            break;
        }
    }
}

function calcStraight(num, obj, value) {
    let count = 0;
    for (let i=1; i<7; i++) {
        if (this.punten[i]) {
            count++
            if (count >= num) {
                break;
            } else {
                count = 0;
            }
        }
        // Set preview logic
    }
}

function calcFullHouse() {
    let three = false, two = false;

    for (let i=1; i<7; i++) {
        if (this.punten[i] * i >= i * 3) {
            three = i;
        }
    }

    // set preview logic (FULLHOUSE)
}

function calcChance() {
    let value = 0;
    for (let i=1; i<7; i++) {
        value += this.punten[i] * i;
    }
    // preview LOGIC (CHANCE)
}