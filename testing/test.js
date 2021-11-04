"use strict";
console.clear();

//screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
//screen.lockOrientationUniversal('portrait');

class diceElement extends HTMLElement {
    static get observedAttributes(){
        return ["value"];
    }
    constructor(){
        super();
        const template = document.getElementById("dice-template");
        this.attachShadow({mode: 'open'});
        this.value      = Number(this.getAttribute("value")) || this.random();
        this.padding    = 3;
        this.top        = 7;
        this.left       = 8;
        this.rolls      = 0;
        this.rolling    = false;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.height = this.offsetHeight;
        this.createDots();
        this.showDots();

        if (window.IntersectionObserver) {
            let observer = new IntersectionObserver(function(entries) {
                if (entries[0].intersectionRatio) {
                    this.height = this.offsetHeight;
                    this.dot_height  = this.shadowRoot.querySelector(".dot").offsetHeight;
                    this.showDots(this);
                }
            }.bind(this), {
                root: document.body
            });
            observer.observe(this.shadowRoot.querySelector("div"));
        }
    }
    random(min = 1, max = 6){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    roll(){
        if (!this.classList.contains("locked")) {
            this.classList.add("rolling");
            this.rolling    = true;
            this.rolls      = this.random(5, 25);
            this.doRoll();
            this.dispatchEvent(new Event('roll-start', {bubbles: true, composed: true}));
        }
    }
    doRoll() {
        let current_value   = this.value;
        this.value          = this.random();
        this.setAttribute("value", this.value);
        if (--this.rolls > 0) {
            window.setTimeout(this.doRoll.bind(this), 60);
        } else {
            while (current_value == this.value) {
                this.value = this.random();
            }
            this.classList.remove("rolling");
            window.setTimeout(function(){
                this.rolling = false;
                this.dispatchEvent(new Event('roll-end', {bubbles: true, composed: true}));
            }.bind(this), 600);
        }
        this.showDots();
    }
    createDots() {
        let dot;
        for (let i=1; i<7; i++) {
            dot = document.createElement("div");
            dot.classList.add("dot", "dot-" + i);
            this.shadowRoot.appendChild(dot);
        }
        this.dot_height  = this.shadowRoot.querySelector(".dot").offsetHeight;
    }
    showDots(){
        let dot;
        let top = this.top;
        for (let i=1; i<7; i++) {
            dot = this.shadowRoot.querySelector(".dot-" + i);
            if (i > this.value) {
                dot.classList.remove("show");
            } else {
                dot.classList.add("show");
            }
            dot.style.top       = "";
            dot.style.bottom    = "";
            dot.style.left      = "";
            dot.style.right     = "";
            switch (this.value) {
                case 6:
                    dot.style.top = top + "px";
                    if (i % 2 == 0) {
                        top += this.dot_height + this.padding;
                        dot.style.left = this.left + "px";
                    } else {
                        dot.style.left = (this.height - this.dot_height - this.left) + "px";
                    }
                    break;
                case 5:
                    switch (i) {
                        case 1:
                            this.dotTopLeft(dot);
                            break;
                        case 2:
                            this.dotTopRight(dot);
                            break;
                        case 3:
                        case 6:
                            this.dotCentre(dot);
                            break;
                        case 4:
                            this.dotBottomLeft(dot);
                            break;
                        case 5:
                            this.dotBottomRight(dot);
                            break;
                    }
                    break;
                case 4:
                    switch (i) {
                        case 4:
                        case 5:
                            this.dotTopLeft(dot);
                            break;
                        case 3:
                            this.dotTopRight(dot);
                            break;
                        case 1:
                            this.dotBottomLeft(dot);
                            break;
                        case 2:
                        case 6:
                            this.dotBottomRight(dot);
                            break;
                    }
                    break;
                case 3:
                    switch (i) {
                        case 1:
                            this.dotTopLeft(dot);
                            break;
                        case 3:
                            this.dotBottomRight(dot);
                            break;
                        default:
                            this.dotCentre(dot);
                            break;
                    }
                    break;
                case 2:
                    if (i % 2 == 0) {
                        this.dotTopLeft(dot);
                    } else {
                        this.dotBottomRight(dot);
                    }
                    break;
                case 1:
                    this.dotCentre(dot);
                    break;
            }
        }
    }
    dotCentre(dot){
        dot.style.top   = ((this.height - this.dot_height) / 2) + "px";
        dot.style.left  = ((this.height - this.dot_height) / 2) + "px";
    }
    dotTopLeft(dot){
        dot.style.left  = this.left + "px";
        dot.style.top   = this.top + "px";
    }
    dotBottomLeft(dot){
        dot.style.left  = this.left + "px";
        dot.style.top   = (this.height - this.dot_height - this.top) + "px";
    }
    dotTopRight(dot){
        dot.style.left  = (this.height - this.dot_height - this.left) + "px";
        dot.style.top   = this.top + "px";
    }
    dotBottomRight(dot){
        dot.style.left  = (this.height - this.dot_height - this.left) + "px";
        dot.style.top   = (this.height - this.dot_height - this.top) + "px";
    }
    attributeChangedCallback(attrName, oldVal, newVal){
        //console.log("changed", attrName, oldVal, newVal);
        switch (attrName) {
            case "value":
                this.value = Number(newVal) ? Number(newVal) : 1;
                this.showDots();
                break;
        }
    }
}
customElements.define('dice-obj', diceElement);

class resultElement extends HTMLElement {
    static get observedAttributes(){
        return ["value", "status"];
    }
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const template = document.getElementById("result-template");
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.value      = 0;
        this.display    = 0;
        this.locked     = false;
        this.span       = document.createElement("span");
        this.span.setAttribute("slot", "value")
        this.appendChild(this.span);

    }
    connectedCallback() {
        this.addEventListener("click", this.doClick.bind(this));
    }
    doClick() {
        if (this.classList.contains("preview") || this.classList.contains("scratch")) {
            this.classList.toggle("selected");
            this.dispatchEvent(new Event(this.classList.contains("selected") ? "result-selected" : "result-deselected", {bubbles: true, composed: true}));
        }
    }
    displayValue(newVal = "") {
        if (this.display < this.value) {
            this.display++;
        } else if (this.display > this.value) {
            this.display--;
        }

        this.span.innerText = this.display;
        let diff = Math.min(Math.max(this.display, this.value) - Math.min(this.display, this.value), 50);

        if (this.display != this.value) {
            window.setTimeout(this.displayValue.bind(this), 70 - diff);
        }
    }
    attributeChangedCallback(attrName, oldVal, newVal = ""){
        switch (attrName) {
            case "value":
                this.value = Number(newVal) ? Number(newVal) : 0;
                if (!Number(newVal)) {
                    this.span.innerText = newVal;
                    this.display = 0;
                } else {
                    this.displayValue(newVal);
                }
                break;
            case "status":
                switch (newVal) {
                    case "preview":
                        this.classList.remove("scratch");
                        this.classList.add("preview");
                        this.locked = false;
                        break;
                    case "locked":
                        this.classList.remove("preview", "selected", "scratch");
                        this.classList.add("locked");
                        this.locked = true;
                        break;
                    case "scratch":
                        this.classList.remove("preview", "locked", "selected");
                        this.classList.add("scratch");
                        break;
                    default:
                        this.classList.remove("preview", "locked", "selected", "scratch");
                        this.locked = false;
                        break;
                }
                break;
        }
    }
}
customElements.define("result-obj", resultElement);

class Yahtzee {
    constructor(){
        this.dice           = document.querySelectorAll("dice-obj.dice");
        this.game_number    = document.getElementById("game-number");
        this.first_roll     = document.getElementById("first-roll");
        this.second_roll    = document.getElementById("second-roll");
        this.third_roll     = document.getElementById("third-roll");
        this.store_roll     = document.getElementById("store-roll");
        this.new_game       = document.getElementById("new-game");

        this.ones           = document.getElementById("ones");
        this.twos           = document.getElementById("twos");
        this.threes         = document.getElementById("threes");
        this.fours          = document.getElementById("fours");
        this.fives          = document.getElementById("fives");
        this.sixes          = document.getElementById("sixes");

        this.three_kind     = document.getElementById("three-of-a-kind");
        this.four_kind      = document.getElementById("four-of-a-kind");
        this.full_house     = document.getElementById("full-house");
        this.small_straight = document.getElementById("small-straight");
        this.large_straight = document.getElementById("large-straight");
        this.yahtzee        = document.getElementById("yahtzee");
        this.chance         = document.getElementById("chance");

        this.upper_score    = document.getElementById("upper-score");
        this.upper_bonus    = document.getElementById("upper-bonus");
        this.upper_total    = document.getElementById("upper-total");
        this.lower_score    = document.getElementById("lower-score");
        this.yahtzee_bonus  = document.getElementById("yahtzee-bonus");
        this.total_score    = document.getElementById("total-score");

        this.grand_total    = document.getElementById("grand-total");
        this.sub_menu       = document.getElementById("sub-menu");
        this.game_results   = document.getElementById("game-results");
        this.instructions   = document.getElementById("instructions-bar");
        this.game           = 1;
        this.col            = 2;
        this.yahtzee_count  = 0;
        this.roll           = 1;
        this.resultElements = [];
        this.total          = 0;
        this.selected       = false;
        this.buttons        = [this.first_roll, this.second_roll, this.third_roll];
        this.first_roll.addEventListener("click", this.rollDice.bind(this));
        this.second_roll.addEventListener("click", this.rollDice.bind(this));
        this.third_roll.addEventListener("click", this.rollDice.bind(this));
        this.store_roll.addEventListener("click", this.lockResult.bind(this));
        this.new_game.addEventListener("click", this.newGame.bind(this));

        document.getElementById("toggle-menu").addEventListener("click", function(e){
            this.sub_menu.classList.toggle("open");
            this.game_results.classList.toggle("open");
        }.bind(this));

        document.getElementById("show-instruction").addEventListener("click", function(){
            this.sub_menu.classList.remove("open");
            this.game_results.classList.remove("open");
            this.instructions.classList.add("open");
        }.bind(this));

        document.getElementById("toggle-instructions").addEventListener("click", function(){
            this.instructions.classList.remove("open");
        }.bind(this));

        for(let die of this.dice) {
            die.addEventListener("click", this.toggleLock.bind(this));
            die.addEventListener("roll-end", this.rollFinished.bind(this));
        }

        this.getResultElements();

        this.game_number.innerText = 1;

        let games = document.querySelectorAll(".game-1");
        for (let game of games) {
            game.classList.add("current-game");
        }

        // testing for rare events like multiple yahtzees
        if (this.test_roll) {
            this.test_roll = document.getElementById("test-roll");
            this.test_roll.addEventListener("click", this.rollDice.bind(this));
        }
    }
    showInstructions() {

    }
    newGame() {
        this.yahtzee_count  = 0;
        this.total          = 0;
        this.col            = 2;
        this.game           = 1;
        this.roll           = 1;
        let games           = document.querySelectorAll(".game-1");
        let results         = document.querySelectorAll("result-obj");

        this.sub_menu.classList.remove("open");
        this.game_results.classList.remove("open");

        for (let game of games) {
            game.classList.remove("completed-game");
            game.classList.add("current-game");
        }

        this.total_score.setAttribute("value", this.total);

        for (let i=2; i<6; i++) {
            games = document.querySelectorAll(".game-" + i);
            for (let game of games) {
                game.classList.remove("current-game", "completed-game");
            }
        }

        let game_results = this.game_results.querySelectorAll(".game-result");
        for (let result of game_results) {
            result.innerText = "";
        }

        this.game_number.innerText = 1;

        for (let result of results) {
            this.updateResult(result, "empty", "");
            result.classList.remove("completed");
        }

        this.store_roll.setAttribute("disabled", true);
        this.buttons[0].removeAttribute("disabled");
        for (let i=1; i<3; i++) {
            this.buttons[i].setAttribute("disabled", true);
            this.buttons[i].classList.remove("clicked");
        }
        this.resetDice();

        this.getResultElements();
    }
    resetDice() {
        this.deselectResult();
        let count = 1;
        for(let die of this.dice) {
            die.classList.remove("locked");
            die.classList.add("start");
            die.setAttribute("value", count++);
        }
    }
    lockResult() {

        //game-results-ones
        let item = this.selected.getAttribute("id");
        //game
        console.log(this.game);
        let result_store = this.game_results.querySelector("." + item + "-" + this.game);

        if (result_store) {
            result_store.innerText = this.selected.value;
        }

        this.selected.setAttribute("status", "locked");

        for (let i=1; i<7; i++) {
            if (this.results[i] == 5) {
                this.yahtzee_count++;
            }
        }

        for (let result of this.resultElements) {
            if (result != this.selected && !result.locked) {
                this.updateResult(result, "empty", "");
            }
        }
        this.store_roll.setAttribute("disabled", true);
        this.roll = 1;
        this.buttons[0].removeAttribute("disabled");
        for (let i=1; i<3; i++) {
            this.buttons[i].setAttribute("disabled", true);
            this.buttons[i].classList.remove("clicked");
        }
        for(let die of this.dice) {
            die.classList.remove("locked");
        }
        let upper       = [this.ones, this.twos, this.threes, this.fours, this.fives, this.sixes];
        let lower       = [this.three_kind, this.four_kind, this.full_house, this.small_straight, this.large_straight, this.yahtzee, this.chance];
        let upper_score = 0;
        let game_over   = true;

        for (let i=0; i< upper.length; i++) {
            upper_score += upper[i].value;
            if (!upper[i].locked) {
                game_over = false;
            }
        }

        this.upper_score.setAttribute("value", upper_score);
        result_store = this.game_results.querySelector(".upper-score-" + this.game);
        if (result_store) {
            result_store.innerText = upper_score;
        }

        let upper_bonus = upper_score >= 63 ? 35 : 0;
        this.upper_bonus.setAttribute("value", upper_bonus);
        result_store = this.game_results.querySelector(".upper-bonus-" + this.game);
        if (result_store) {
            result_store.innerText = upper_bonus;
        }

        let upper_total = upper_bonus + upper_score;
        this.upper_total.setAttribute("value", upper_total);
        result_store = this.game_results.querySelector(".upper-total-" + this.game);
        if (result_store) {
            result_store.innerText = upper_total;
        }

        let lower_score = 0;
        for (let i=0; i< lower.length; i++) {
            lower_score += lower[i].value;
            if (!lower[i].locked) {
                game_over = false;
            }
        }
        this.lower_score.setAttribute("value", lower_score);
        result_store = this.game_results.querySelector(".lower-total-" + this.game);
        if (result_store) {
            result_store.innerText = lower_score;
        }

        let yhatzee_bonus = this.yahtzee_count > 1 ? (this.yahtzee_count - 1) * 100 : 0;
        this.yahtzee_bonus.setAttribute("value", yhatzee_bonus);
        result_store = this.game_results.querySelector(".yahtzee-bonus-" + this.game);
        if (result_store) {
            result_store.innerText = yhatzee_bonus;
        }

        let grand_total = upper_total + lower_score +  this.yahtzee_bonus.value;

        this.grand_total.setAttribute("value", grand_total);
        result_store = this.game_results.querySelector(".game-total-" + this.game);
        if (result_store) {
            result_store.innerText = grand_total;
        }

        this.total_score.setAttribute("value", this.total + grand_total);

        if (game_over) {
            this.total += grand_total;
            this.yahtzee_count = 0;
            let results = document.querySelectorAll("result-obj");

            for (let result of results) {
                this.updateResult(result, "empty", "");
                result.classList.remove("completed");
            }

            /*
            let games = document.querySelectorAll(".game-" + (this.col - 1));
            for (let game of games) {
                game.classList.remove("current-game");
                game.classList.add("completed-game");
                game.querySelector("result-obj").classList.add("completed");
            }
            */
            for(let die of this.dice) {
                die.classList.add("start");
            }
            console.log(this.col);
            if (this.col < 6) {
                this.col++;
                this.game++;
                /*
                games = document.querySelectorAll(".game-" + (this.col - 1));
                for (let game of games) {
                    game.classList.add("current-game");
                }
                */
                this.getResultElements();
                this.game_number.innerText = this.col - 1;
            } else {
                this.buttons[0].setAttribute("disabled", true);
                this.buttons[0].classList.remove("clicked");
                this.game_number.innerText = "over";
            }
            this.resetDice();
        } else {
            let event = new Event("click");
            this.first_roll.dispatchEvent(event);
        }
    }
    getResultElements() {
        if (this.resultElements) {
            for (let result of this.resultElements) {
                result.removeEventListener("result-selected", this.selectResult);
                result.removeEventListener("result-deselected", this.deselectResult);
            }
        }

        this.resultElements = document.querySelectorAll("result-obj.game-score");

        for (let result of this.resultElements) {
            result.addEventListener("result-selected", this.selectResult.bind(this));
            result.addEventListener("result-deselected", this.deselectResult.bind(this));
        }
    }
    deselectResult(e) {
        this.store_roll.setAttribute("disabled", true);
        this.selected = false;
    }
    selectResult(e) {
        for (let result of this.resultElements) {
            if (result != e.target && result.classList.contains("selected")) {
                result.classList.remove("selected");
            }
        }
        this.selected = e.target;
        this.store_roll.removeAttribute("disabled");
    }
    rollFinished(e) {
        let finished = true;
        for(let die of this.dice) {
            if (die.rolling) {
                finished = false;
            }
        }

        this.setResults();
        this.doCalculations();

        if (finished) {
            if (this.roll < 3) {
                this.buttons[this.roll++].removeAttribute("disabled");
            }
        }
    }
    doCalculations() {
        this.calcNumbers(1, this.ones);
        this.calcNumbers(2, this.twos);
        this.calcNumbers(3, this.threes);
        this.calcNumbers(4, this.fours);
        this.calcNumbers(5, this.fives);
        this.calcNumbers(6, this.sixes);

        this.calcKind(3, this.three_kind);
        this.calcKind(4, this.four_kind);
        this.calcFullHouse();
        this.calcStraight(4, this.small_straight, 30);
        this.calcStraight(5, this.large_straight, 40);
        this.calcYahtzee();
        this.calChance();

    }
    setResults() {
        this.results = {1:0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
        for(let die of this.dice) {
            if (!die.rolling) {
                this.results[die.value]++;
            }
        }
    }
    calcYahtzee() {
        let found = false;
        for (let i=1; i<7; i++) {
            if (this.results[i] == 5) {
                found = true;
                break;
            }
        }

        this.setPreview(this.yahtzee, found ? 50 : false);
    }
    calcStraight(num, obj, value) {
        let count = 0;
        for (let i=1; i<7; i++) {
            if (this.results[i]) {
                count++;
                if (count >= num) {
                    break;
                }
            } else{
                count = 0;
            }
        }
        this.setPreview(obj, count >= num ? value : false);
    }
    calcFullHouse() {
        let three = false, two = false;

        for (let i=1; i<7; i++) {
            if (this.results[i] * i >= i * 3) {
                three = i;
            }
        }

        for (let i=1; i<7; i++) {
            if (this.results[i] * i >= i * 2 && i != three) {
                two = i;
            }
        }

        this.setPreview(this.full_house, three && two ? 25 : false);
    }
    setPreview(obj, value) {
        if (!obj.locked) {
            if (value) {
                this.updateResult(obj, "preview", value);
            } else if (this.roll == 3) {
                this.updateResult(obj, "scratch", "-");
            } else {
                this.updateResult(obj, "empty", "");
            }
        }
    }
    updateResult(obj, status, value) {
        obj.setAttribute("status", status);
        obj.setAttribute("value", value);
    }
    calcNumbers(num, row) {
        this.setPreview(row, this.results[num] * num);
    }
    calChance() {
        let value = 0;
        for (let i=1; i<7; i++) {
            value += this.results[i] * i;
        }
        this.setPreview(this.chance, value);
    }
    calcKind(num, obj) {
        let value = 0, allowed = false;
        for (let i=1; i<7; i++) {
            value += this.results[i] * i;
            if (this.results[i] * i >= i * num) {
                allowed = true;
            }
        }
        this.setPreview(obj, allowed ? value : false);
    }
    rollDice(e){
        this.deselectResult();
        //this.setResults();
        //this.doCalculations();
        let button = e.target;
        if (button != this.test_roll) {
            button.classList.add("clicked");
            button.setAttribute("disabled", true);
        }
        for (let result of this.resultElements) {
            if (!result.locked) {
                this.updateResult(result, "empty", "");
            }
        }
        for(let die of this.dice) {
            if (this.roll == 1) {
                die.classList.remove("start");
            }
            die.roll();
        }
    }
    toggleLock(e){
        if (this.roll > 1) {
            let die = e.target;
            die.classList.toggle("locked");
        }
    }
}

const YAHTZEE = new Yahtzee();

