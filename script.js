// Justin


// gegooide stenen array
let punten = [];

// hoeveel ... is er gegooit?
let  een = 0;
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
        if (element == 1) {  een++; }
        if (element == 2) { twee++; }
        if (element == 3) { drie++; }
        if (element == 4) { vier++; }
        if (element == 5) { vijf++; }
    });
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
    
        steen1vast = false;
        steen2vast = false;
        steen3vast = false;
        steen4vast = false;
        steen5vast = false;

        worpenover--;
    } else if (worpenover == 0) {
        // geen worpen over
    }
}

gooien();

document.write("<p> je hebt dit gegooit: " + 
punten[0] + ", " + 
punten[1] + ", " + 
punten[2] + ", " + 
punten[3] + ", " + 
punten[4] )

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