function parseCSVtoMatrix(strCSV) {
    var buff = parseCSV(strCSV);
    return transformArrayToMatrix(buff);
}

function parseCSVtoArray(strCSV) {
    try {
        let data = []
        let regex = /("([^"]|"")*"|([^",\n]*))?(,|\n)?/
        let size = 0;
        let check = false;
        while (regex.test) {
            let buff = regex.exec(strCSV);
            if (buff[0] === "") {
                break;
            }
            let current = buff[1]
            if (buff[1][0] === '"') {
                current = "";
                for (let i = 1; i < buff[1].length - 1; i++) {
                    current += buff[1][i];
                }
            }
            data[data.length] = current
            if ((!check) && (buff[4] === '\n')) {
                check = true;
                size++;
            }
            else {
                if (!check) {
                    size++;
                }
            }
            strCSV = strCSV.replace(regex, "")
        }

        data[data.length] = size;
        return data; // data = [yourData,yourData,yourData,yourData..., rowSize]
    }
    catch{
        alert("Your test is uncorrect")
        return

    }

}

function transformArrayToMatrix(array) {
    var matrix = []
    var count = 0;
    for (var i = 0; i < (array.length - 1) / array[array.length - 1]; i++) {
        matrix[i] = []
        for (var j = 0; j < array[array.length - 1]; j++) {
            matrix[i][j] = array[count];
            count++;
        }
    }

    return matrix;
}