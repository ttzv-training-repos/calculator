class BasicMath {

    add(a, b) {
        return a+b;
    }

    subtract(a, b){
        return a-b;
    }

    multiply(a, b){
        return a*b;
    }

    divide(a, b){
        return a/b;
    }
}

class Evaluator{
    constructor(basicMath){
        this.arg1 = 'null';
        this.arg2 = 'null';
        this.operation = 'null';
        this.basicMath = basicMath;
        this.history = [];
        this.canEvaluate = false;
    }

    put(value){
        if(this.arg1 === 'null'){
            this.arg1 = value
            this.history.push(this.arg1);
        } else if (this.arg2 === 'null'){
            this.arg2 = value;
            this.history.push(this.arg2);
            if(this.operation !== 'null'){
                this.canEvaluate = true;
            }
        }
    }

    setOperation(op){
        this.operation = op;
        let opSymbol = this.getSymbol(op);
        if(typeof this.history[this.history.length - 1] === 'string'){
            this.history[this.history.length - 1] = opSymbol;
        }
        else{
            this.history.push(opSymbol);
        }
    }

    clearArg2(){
        this.arg2 = 'null';
        this.canEvaluate = false;
    }

    clearAll(){
        this.arg1 = 'null';
        this.arg2 = 'null';
        this.operation = 'null';
        this.history = [];
        this.canEvaluate = false;
    }

    evaluate(){
        let result;
        switch (this.operation) {
            case 'add':
                result = basicMath.add(this.arg1, this.arg2);
                break;
            case 'subtract':
                result = basicMath.subtract(this.arg1, this.arg2);
                break;
            case 'divide':
                result = basicMath.divide(this.arg1, this.arg2);
                break;
            case 'multiply':
                result = basicMath.multiply(this.arg1, this.arg2);
                break;
            default:
                console.error('no such operation: ' + this.operation);
                break;
        }
        this.arg1 = result;
        return result;
    } 

    getSymbol(operationName){
        switch (operationName) {
            case 'add':
                return ' + '
            case 'subtract':
                return ' - ';
            case 'divide':
                return ' / ';
            case 'multiply':
                return ' * ';       
            default:
                console.error('no such operation: ' + this.operation);
                break;
        }
    }

    getHistory(){
        if(this.history.length > 1){
            return this.history.join('');
        }
    }
}


const basicMath = new BasicMath();
const evaluator = new Evaluator(basicMath);

const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
    button.addEventListener('click', handleBtnClick);
    button.addEventListener('mousedown', btnPressedStyle);
    button.addEventListener('mouseup', btnPressedStyle);
    button.addEventListener('mouseleave', delBtnPressedStyle);
});

function btnPressedStyle(){
    this.classList.toggle('click');
}

function delBtnPressedStyle(){
    if(this.classList.value.includes('click')){
        this.classList.toggle('click');
    }
}

function handleBtnClick(btn){
    let opName = btn.target.getAttribute('data-op-name');
    let dataInput = btn.target.getAttribute('data-input');
    if(!opName){ //has no data-op-name attribute - is a digit or dot
        digitInput(dataInput);
    } else {
        operationInput(opName);
    }
    console.log(evaluator);
    updateSubDisplay(evaluator.getHistory());
} 

let canOverwriteInput;
function digitInput(input){
    if(evaluated){
        clear();
        evaluated = false;
        operationSelected = false;
    }
    updateMainDisplay(input);
    canOverwriteInput = false;
    digitSelected = true;
}

let operationSelected = false;
function operationInput(input){
    switch (input) {
        case 'clear':
            clear();
            break;
        case 'result':
            canOverwriteInput = true;
            handleEvaluation();
            break;
        default:
            canOverwriteInput = true;
            handleOperation(input);
            break;
    }
}

let evaluated = false;
let digitSelected = true;
function evaluateResult(){
    if(evaluator.canEvaluate){
        updateMainDisplay(evaluator.evaluate());
        digitSelected = false;
        evaluated = true;
    }
}
    
function handleEvaluation(){
    if(operationSelected){
        evaluator.put(getInput());
    }
    evaluateResult();
}

function handleOperation(operation){
    evaluator.clearArg2();
    if(digitSelected){
        digitSelected = false;
        evaluator.put(getInput());
        evaluateResult();
        evaluator.setOperation(operation);
        operationSelected = true;
    } else {
        evaluator.setOperation(operation);
    }
    evaluated = false;
}

const cResult = document.querySelector('.current-result');
function updateMainDisplay(string){
    let cResultText = cResult.textContent
    if(cResultText === '0'){ canOverwriteInput = true; }
    if(string !== '.'){
        if(canOverwriteInput){
            cResultText = string;
        } else {
            cResultText += string;
        }
    } else {
        if(canOverwriteInput){
            cResultText = '0.'
        } else if(!cResultText.includes('.')){
            cResultText += string;
        }
    }
    cResult.textContent = cResultText;
}

const cResultSub = document.querySelector('.disp-operations');
function updateSubDisplay(string){
    cResultSub.textContent = string;
}

function getInput(){
    let cResultNumber = cResult.textContent;
    if(cResultNumber.includes('.')){
        return parseFloat(cResultNumber)
    }
    return parseInt(cResultNumber);
}

function clear() {
    cResult.textContent = '0';
    cResultSub.textContent = ''
    evaluator.clearAll();
}

