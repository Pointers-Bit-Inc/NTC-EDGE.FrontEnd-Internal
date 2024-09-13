class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    clearQueue() {
        this.elements = {};
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }
}

class EquationGenerator {
    constructor(numbers, targetValue) {
        this.numbers = numbers
        this.targetValue = targetValue

        this.solvedKeys = [];


        this.keyToLeftParent = {};


        this.keyToRightParent = {};


        this.keyToOperator = {};


        this.queue = new Queue();

        this.solutionString = "";
        this.isSolved = false;
    }

    initialStates() {

        this.isSolved = false;
        this.solvedKeys = [];
        this.keyToLeftParent = {};
        this.keyToRightParent = {};
        this.keyToOperator = {};
        this.queue.clearQueue();
        this.solutionString = "";
    }

    generateAndPrint() {
        this.generate();
        this.printSolution();
        return this.solutionString;
    }

    generate() {
        this.initialStates();

        let targetKey = (this.targetValue << this.numbers.length) + (1 << this.numbers.length) - 1;


        for (let i = 0; i < this.numbers.length; i++) {

            let key = (this.numbers[i] << this.numbers.length) + (1 << i);

            this.solvedKeys.push(key);
            this.queue.enqueue(key);
        }


        while (!this.queue.isEmpty && !this.solvedKeys.includes(targetKey)) {

            let curKey = this.queue.dequeue();

            let curMask = curKey & ((1 << this.numbers.length) - 1);
            let curValue = curKey >> this.numbers.length;


            let keys = JSON.parse(JSON.stringify(this.solvedKeys));
            for (let i = 0; i < keys.length; i++) {

                let mask = keys[i] & ((1 << this.numbers.length) - 1);
                let value = keys[i] >> this.numbers.length;
                if ((mask & curMask) === 0) {


                    for (let op = 0; op < 6; op++) {


                        let {newValue, opSign} = this.performOperations(value, curValue, op)


                        this.validateAndPushValueWithSign(newValue, opSign, op, curMask, curKey, mask, keys[i])
                    }
                }
            }
        }
        if (this.solvedKeys.includes(targetKey)) {
            this.isSolved = true;
        }
    }

    printSolution() {
        if (!this.isSolved) {
            this.solutionString = "Solution not possible.";
            return false;
        }


        let targetKey = (this.targetValue << this.numbers.length) + (1 << this.numbers.length) - 1;
        this.solutionString = "";
        this.printExpression(targetKey, this.numbers.length);
        return this.solutionString;
    }

    printExpression(key, numbersCount) {

        if (typeof this.keyToOperator[key] == 'undefined') {
            this.solutionString += (key >> numbersCount);
        } else {
            this.solutionString += "(";

            this.printExpression(this.keyToLeftParent[key], this.numbers.length);


            this.solutionString += this.keyToOperator[key];


            this.printExpression(this.keyToRightParent[key], this.numbers.length);

            this.solutionString += ")";

        }
    }

    performOperations(value, curValue, op) {
        let opSign = '\0';
        let newValue = 0;

        switch (op) {
            case 0:
                newValue = curValue + value;
                opSign = '+';
                break;
            case 1:
                newValue = curValue - value;
                opSign = '-';
                break;
            case 2:
                newValue = value - curValue;
                opSign = '-';
                break;
            case 3:
                newValue = curValue * value;
                opSign = '*';
                break;
            case 4:
                newValue = -1;
                if (value !== 0 && curValue % value === 0) newValue = curValue / value;
                opSign = '';
                break;
            case 5:
                newValue = -1;
                if (curValue !== 0 && value % curValue === 0) newValue = value / curValue;
                opSign = '';
                break;
            default:
                opSign = '\0';
                newValue = 0;
        }

        return {newValue, opSign};
    }

    validateAndPushValueWithSign(newValue, opSign, opIndex, curMask, curKey, mask, current_key_value) {

        if (newValue >= 0) {
            let newMask = (curMask | mask);
            let newKey = (newValue << this.numbers.length) + newMask;
            if (!this.solvedKeys.includes(newKey)) {
                this.solvedKeys.push(newKey);

                if (opIndex === 2 || opIndex === 5) {
                    this.keyToLeftParent[newKey] = current_key_value;
                    this.keyToRightParent[newKey] = curKey;
                } else {
                    this.keyToLeftParent[newKey] = curKey;
                    this.keyToRightParent[newKey] = current_key_value;
                }

                this.keyToOperator[newKey] = opSign;
                this.solvedKeys.push(newKey);
                this.queue.enqueue(newKey);

            }

        }
    }
}


export default EquationGenerator