let data = [
    ["outlook",     "temperature",  "humidity",     "windy",    "play"  ],
    ["overcast",    "hot",          "high",         "FALSE",    "yes"   ],
    ["overcast",    "cool",         "normal",       "TRUE",     "yes"   ],
    ["overcast",    "mild",         "high",         "TRUE",     "yes"   ],
    ["overcast",    "hot",          "normal",       "FALSE",    "yes"   ],
    ["rainy",       "mild",         "high",         "FALSE",    "yes"   ],
    ["rainy",       "cool",         "normal",       "FALSE",    "yes"   ],
    ["rainy",       "cool",         "normal",       "TRUE",     "no"    ],
    ["rainy",       "mild",         "normal",       "FALSE",    "yes"   ],
    ["rainy",       "mild",         "high",         "TRUE",     "no"    ],
    ["sunny",       "hot",          "high",         "FALSE",    "no"    ],
    ["sunny",       "hot",          "high",         "TRUE",     "no"    ],
    ["sunny",       "mild",         "high",         "FALSE",    "no"    ],
    ["sunny",       "cool",         "normal",       "FALSE",    "yes"   ],
    ["sunny",       "mild",         "normal",       "TRUE",     "yes"   ]
];

data = [
    ["Соперник",    "Играем",       "Лидеры",       "Дождь",    "Победа"    ],
    ["Выше",        "Дома",         "На месте",     "Да",       "Нет"       ],
    ["Выше",        "Дома",         "На месте",     "Нет",      "Да"        ],
    ["Выше",        "Дома",         "Пропускают",   "Нет",      "Нет"       ],
    ["Ниже",        "Дома",         "Пропускают",   "Нет",      "Да"        ],
    ["Ниже",        "В гостях",     "Пропускают",   "Нет",      "Нет"       ],
    ["Ниже",        "Дома",         "Пропускают",   "Да",       "Да"        ],
    ["Выше",        "В гостях",     "На месте",     "Да",       "Нет"       ],
    ["Ниже",        "В гостях",     "На месте",     "Нет",      "Да"        ]
];

data = [
    ["Осадки",          "Температура",  "Влажность",    "Ветер",    "Класс"     ],
    ["Солнечно",        "Жарко",        "Высокая",      "Нет",      "Не играть" ],
    ["Солнечно",        "Жарко",        "Высокая",      "Да",       "Не играть" ],
    ["П. облачность",   "Жарко",        "Высокая",      "Нет",      "Играть"    ],
    ["Пасмурно",        "Умеренно",     "Высокая",      "Нет",      "Играть"    ],
    ["Пасмурно",        "Прохладно",    "Нормальная",   "Нет",      "Играть"    ],
    ["Пасмурно",        "Прохладно",    "Нормальная",   "Да",       "Не играть" ],
    ["П. облачность",   "Прохладно",    "Нормальная",   "Да",       "Играть"    ],
    ["Солнечно",        "Умеренно",     "Высокая",      "Нет",      "Не играть" ],
    ["Солнечно",        "Прохладно",    "Нормальная",   "Нет",      "Играть"    ],
    ["Пасмурно",        "Умеренно",     "Нормальная",   "Нет",      "Играть"    ],
    ["Солнечно",        "Умеренно",     "Нормальная",   "Да",       "Играть"    ],
    ["П. облачность",   "Умеренно",     "Высокая",      "Да",       "Играть"    ],
    ["П. облачность",   "Жарко",        "Нормальная",   "Нет",      "Играть"    ],
    ["Пасмурно",        "Умеренно",     "Высокая",      "Да",       "Не играть" ]
];

data = [
    ["usd",     "lamphat",  "nctt",     "slkt",     "play " ],
    ["TANG",    "GIAM",     "THAP",     "TB",       "THAP " ],
    ["TANG",    "TANG",     "THAP",     "TB",       "CAO "  ],
    ["TANG",    "ON DINH",  "CAO",      "TB",       "CAO "  ],
    ["TANG",    "TANG",     "THAP",     "THAP",     "CAO "  ],
    ["TANG",    "GIAM",     "TB",       "THAP",     "CAO "  ],
    ["TANG",    "GIAM",     "CAO",      "THAP",     "THAP " ],
    ["TB",      "ON DINH",  "TB",       "CAO",      "THAP " ],
    ["TB",      "GIAM",     "THAP",     "CAO",      "THAP " ],
    ["TB",      "TANG",     "TB",       "THAP",     "THAP " ],
    ["TB",      "ON DINH",  "CAO",      "TB",       "CAO "  ],
    ["TB",      "GIAM",     "CAO",      "CAO",      "CAO "  ],
    ["GIAM",    "ON DINH",  "CAO",      "THAP",     "THAP " ],
    ["GIAM",    "GIAM",     "CAO",      "CAO",      "CAO "  ],
    ["GIAM",    "TANG",     "CAO",      "TB",       "THAP " ],
    ["GIAM",    "TANG",     "THAP",     "THAP",     "THAP " ],
    ["GIAM",    "ON DINH",  "CAO",      "TB",       "CAO "  ]
];

buildTree(data);
var treeRoot = document.getElementById("root");

function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    let nodeName = currentNode.nodeName;
    let atr = "Ответ"
    if(currentNode.atribute !== undefined) {
        atr = currentNode.atribute
    }
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