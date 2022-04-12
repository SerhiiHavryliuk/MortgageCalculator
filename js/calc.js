const selectBank = document.querySelector('.selectBank');

const inputInitialLoan = document.querySelector('.inputInitialLoan');
const inputDownPayment = document.querySelector('.inputDownPayment');
const inputTotalMouns = document.querySelector('.inputTotalMouns');

const totalMouns = document.querySelector('.totalMouns');
const btnCalc = document.querySelector('.btnCalc');
const resultCalc = document.querySelector('.resultCalc');

const localStoreListBanks = "banksData";

const bankList = document.querySelector('.bankInfo');


window.addEventListener('load', init);

selectBank.addEventListener('change', changeBank);

inputInitialLoan.addEventListener('change', changeValue);
inputDownPayment.addEventListener('change', changeValue);
inputTotalMouns.addEventListener('change', changeValue);

btnCalc.addEventListener('click', calcResult);


function init(){
    // проверка наличия в localStore списка банков
    if (localStorage.getItem(localStoreListBanks)) {
        // очищаем контейнер
        clearHTMLContainer(selectBank);

        // загружаем текущий список банков и преобразовываем его в массив
        let arrayListBanks = stringToArr(readDataLocalStorga());

        console.log(arrayListBanks);

        // Содаем option и помещаем туда название банка
        for (let i = 0; i < arrayListBanks.length; i++) {
            const option = document.createElement('option');
            option.textContent = arrayListBanks[i][0];
            option.setAttribute("value", i);
            selectBank.appendChild(option);
        }

        // показываем в информацию по первому банку
        showBank(arrayListBanks, 1);
    }
}

function showBank(newBank, dataIdBank) {
    console.log("showBank");

        // Создаем элемент списка куда будет помещатся вся инфа про банк
        const li = document.createElement('li');

        // Сздаем 5 ячеек и помещаем туда информацию о банке
        for (let i = 0; i < newBank[dataIdBank].length; i++) {
            const cell = document.createElement('p');
            cell.textContent = newBank[dataIdBank][i];
            li.appendChild(cell);
        }

        // добавляем готовый элемент в контейнер на стр
        bankList.appendChild(li);
}

function changeBank(e){
    console.log("changeBank");

    // загружаем текущий список банков и преобразовываем его в массив
    let arrayListBanks = stringToArr(readDataLocalStorga());

    // считываем текущее значение банака с селект
    let valueSelect = e.target.value;

    // очищаем контейнер где была инфа по банку
    clearHTMLContainer(bankList);

    // показываем под селектом информацию по первому банку
    showBank(arrayListBanks, valueSelect);
}

// функция меняем значение взависимости от изменений на ползунке
function changeValue(e) {
    console.log("changeValue");

    let parentElement = e.target.parentNode;
    let notes = null;
    for (var i = 0; i < parentElement.childNodes.length; i++) {
        if (parentElement.childNodes[i].className == "inputValue") {
            notes = parentElement.childNodes[i];
            notes.innerHTML = e.target.value;
            break;
        }
    }
}

function calcResult() {
    console.log("calcResult");
    let a1 = inputInitialLoan.value;
    let a2 = inputDownPayment.value;
    let a3 = inputTotalMouns.value;
    let result = a1 + a2 + a3;
    resultCalc.innerHTML = result;
}

// Функция для считывания данных с localStorage
// считываем значение 'localStoreListBanks'
function readDataLocalStorga() {
    return localStorage.getItem(localStoreListBanks);
}

// функция для очистки HTML контейнера
function clearHTMLContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Функция преобразования строки в массив
function stringToArr(string) {
    return JSON.parse(string)
}