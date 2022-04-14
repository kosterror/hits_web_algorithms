start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);

function start() {
    bypassTree();
}
function reset() {
    treeRoot = removeTree(treeRoot);
    drawTree(root, treeRoot);
}

document.getElementById('input_data').value = "TANG,ON DINH,CAO,TB"
buildTree(getData(3));
var treeRoot = document.getElementById("root");

function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.nodeName;
    let atr = currentNode.atribute
    if(nodeName === "root") {
        a.textContent = nodeName;
    }
    else {
        a.textContent = atr + " = " + nodeName;
    }
    
    li.appendChild(a);
    treeElement.appendChild(li);
    if(currentNode.isLeaf()){
        return;
    }
    let ul = document.createElement("ul");
    li.appendChild(ul);
    for (let i = 0; i < currentNode.branches.length; i++) {
        drawTree(currentNode.branches[i], ul);
    }
}

function removeTree(rootElement) {
    let divTree = document.getElementById("tree");
    treeRoot.remove();
    let ul = document.createElement("ul");
    divTree.appendChild(ul);
    return ul;
}

drawTree(root, treeRoot);