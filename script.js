// Justin
let punten = [];

let  een = 0;
let twee = 0;
let drie = 0;
let vier = 0;
let vijf = 0;

function gooien() {
    punten[0] = dobbelsteen();
    punten[1] = dobbelsteen();
    punten[2] = dobbelsteen();
    punten[3] = dobbelsteen();
    punten[4] = dobbelsteen();

    punten.forEach(element => {
        if (element == 1) {  een++; }
        if (element == 2) { twee++; }
        if (element == 3) { drie++; }
        if (element == 4) { vier++; }
        if (element == 5) { vijf++; }
    });
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