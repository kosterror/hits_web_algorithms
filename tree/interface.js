buildTree(getData(3));
var treeRoot = document.getElementById("root");

function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
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
drawTree(root, treeRoot);