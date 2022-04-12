/*
*
*   этот файл содержит те еще раритеты, 
*   после которых читающему скорее всего захочется разбить экран комьютера,
*   выкинуть его в окно и забыть программирование, как страшный сон.   
*   исходя из вышенаписанного, дальнейшее чтение этого кода 
*   будет являться добровольным истязанием самого себя 
*
*/





class Node {
    constructor() {
        let nodeName;
        let data;
        let branches = [];
        let atribute = ""
        let atributeNumber = ""
    }

    setName(name) {
        this.nodeName = name;
    }
    setAtribute(atr) {
        this.atribute = atr;
    }
    setAtributeNum(num) {
        this.atributeNumber = num;
    }
    setData(data) {
        this.data = [];
        for (var i = 0; i < data.length; i++) {
            this.data[i] = []
            for (var j = 0; j < data[i].length; j++) {
                this.data[i][j] = data[i][j];
            }
        }
    }

    isLeaf() {
        if (this.branches == undefined) {
            return true;
        }
        else if(this.branches.length == 0) {
            return true;
        }

        return false;
    }
}

let dataTree;
let positiveAtribute;
let root;

function buildTree(data) {
    dataTree = data;
    positiveAtribute = dataTree[1][dataTree[1].length - 1];
    root = new Node();
    root.setName("root");
    root.setData(dataTree);
    growBranch(root);
}

function growBranch(currentNode) {
    let branches = getBranches(currentNode.data);
    currentNode.branches = branches;
    var currentData = currentNode.data;
    for (var i = 0; i < branches.length; i++) {
        var nextData = []
        for (var j = 0; j < currentData.length; j++) {
            if (j === 0) {
                nextData[nextData.length] = [currentData[j].length];
                for (var k = 0; k < currentData[j].length; k++) {
                    nextData[nextData.length - 1][k] = currentData[j][k]
                }
            }
            else if (currentData[j][branches[i].atributeNumber] === branches[i].nodeName) {
                nextData[nextData.length] = [currentData[j].length];
                for (var k = 0; k < currentData[j].length; k++) {
                    nextData[nextData.length - 1][k] = currentData[j][k];
                }
            }
        }
        if (nextData.length === 1) {
            for (let j = 0; j < currentData.length; j++) {
                let flag = false;
                for (let k = 0; k < currentData[j].length; k++) {
                    if (currentData[j][k] === branches[i].nodeName) {
                        branches[i].setName(currentData[j][currentData[j].length - 1]);
                        flag = true;
                    }
                    if (flag)
                        break;
                }
            }
            continue
        }
        branches[i].setData(nextData);
        if (branches.length === 1) {
            return;
        }
        growBranch(branches[i]);
    }
}

function getBranches(data) {
    let gain = calculateGain(data);
    let branches = [];
    let max = -1;
    let ind;
    for (var i = 0; i < gain.length; i++) {
        if (max < gain[i]) {
            max = gain[i];
            ind = i;
        }
    }
    let atr = []
    let wasAdded;
    for (var i = 1; i < data.length; i++) {
        wasAdded = false;
        for (var j = 0; j < atr.length; j++) {
            if (atr[j] === data[i][ind]) {
                wasAdded = true;
                break;
            }
        }
        if (!wasAdded) {
            atr[atr.length] = data[i][ind];
        }
    }

    for (var i = 0; i < atr.length; i++) {
        branches[i] = new Node();
        if (gain.length === 1) {
            branches[i].setName(data[1][data[0].length - 1])
            return branches;
        }
        branches[i].setName(atr[i])
        branches[i].setAtribute(data[0][ind])
        branches[i].setAtributeNum(ind);
    }

    return branches;
}

function calculateGain(data) {
    let entropy = calculateEntropy(data);
    let res = [];
    for (var j = 1; j < data.length; j++) {
        res[res.length] = data[j][data[j].length - 1];
    }
    let resultEntropy = getCountUnique(res, res);
    if (resultEntropy.length === 1) {
        return [0];
    }
    let gain = [];


    for (let i = 0; i < entropy.length; i++) {
        if (resultEntropy[0][0] === positiveAtribute) {
            gain[i] = -(resultEntropy[0][1] / (data.length - 1)) * Math.log2(resultEntropy[0][1] / (data.length - 1));
            gain[i] -= (resultEntropy[1][2] / (data.length - 1)) * Math.log2(resultEntropy[1][2] / (data.length - 1));
        }
        else {
            gain[i] = -(resultEntropy[1][1] / (data.length - 1)) * Math.log2(resultEntropy[1][1] / (data.length - 1));
            gain[i] -= (resultEntropy[0][2] / (data.length - 1)) * Math.log2(resultEntropy[0][2] / (data.length - 1));
        }
        for (let j = 0; j < entropy[i].length; j++) {
            if (entropy[i][j] === 0) {
                continue;
            }
            gain[i] = gain[i] - entropy[i][j] / (data.length - 1);
        }
    }

    return gain;
}

function calculateEntropy(data) {
    let entropy = [];

    uniqe = []
    for (let i = 0; i < data[0].length - 1; i++) {
        entropy[i] = [];
        let atr = [];
        let res = [];
        for (var j = 1; j < data.length; j++) {
            atr[atr.length] = data[j][i];
            res[res.length] = data[j][data[j].length - 1];
        }
        uniqe = getCountUnique(atr, res);
        for (let j = 0; j < uniqe.length; j++) {
            let positive;
            let negtive;
            if (uniqe[j][2] === 0) {
                negtive = 0;
            }
            else {
                negtive = uniqe[j][2] / (uniqe[j][1] + uniqe[j][2]);
                negtive = - negtive * Math.log2(negtive)
            }
            if (uniqe[j][1] === 0) {
                positive = 0;
            }
            else {
                positive = uniqe[j][1] / (uniqe[j][1] + uniqe[j][2]);
                positive = - positive * Math.log2(positive)
            }
            entropy[i][j] = positive + negtive;
            entropy[i][j] *= (uniqe[j][1] + uniqe[j][2])
        }
    }
    return entropy
}

function getCountUnique(atribute, result) {
    let keys = [];
    let wasAdded;
    for (let i = 0; i < atribute.length; i++) {
        wasAdded = false;
        for (let j = 0; j < keys.length; j++) {
            if (atribute[i] === keys[j][0]) {
                if (result[i] === positiveAtribute) {
                    keys[j][1]++;
                }
                else {
                    keys[j][2]++;
                }
                wasAdded = true;
                break;
            }
        }
        if (!wasAdded) {
            keys[keys.length] = []
            keys[keys.length - 1][0] = atribute[i];
            keys[keys.length - 1][1] = 0;
            keys[keys.length - 1][2] = 0;
            if (result[i] === positiveAtribute) {
                keys[keys.length - 1][1]++;
            }
            else {
                keys[keys.length - 1][2]++;
            }
        }
    }
    return keys;
}