// пример калькулятор для тестирования 
// https://www.calculator.net/payment-calculator.html

// ------------------------------------------------------------------------------
// Переменные
// ------------------------------------------------------------------------------

const selectBank = document.querySelector('.selectBank'); // select
const btnCalc = document.querySelector('.btnCalc'); // кнопка calc
const resultCalc = document.querySelector('.resultCalc'); // контейнер куда будем вставлять  результат расчетов
const localStoreListBanks = "banksData"; // название переменной в localStorage, куда записываем все данные банков
const bankList = document.querySelector('.bankInfo');// контейнер куда будем вставлять данные выбраного банка
const messageError = document.querySelector('.calcEror');


// ------------------------------------------------------------------------------
// Обработчики событий
// ------------------------------------------------------------------------------

window.addEventListener('load', init);// в init выполняем первоначальнуюинициализацию данных на странице
selectBank.addEventListener('change', changeBank); // отслеживаем изменения банка в компоненте select
btnCalc.addEventListener('click', calcMounthlyPayment); // отслеживаем клик по кнопке Calc


// ------------------------------------------------------------------------------
// Функции
// ------------------------------------------------------------------------------

// первоначальная инициализация данных на странице
function init() {
    // проверка наличия в localStore списка банков
    if (localStorage.getItem(localStoreListBanks)) {
        // очищаем контейнер
        clearHTMLContainer(selectBank);

        // загружаем текущий список банков и преобразовываем его в массив
        let arrayListBanks = stringToArr(readDataLocalStorga());

        // Содаем option и помещаем туда название банка
        for (let i = 0; i < arrayListBanks.length; i++) {
            const option = document.createElement('option');
            option.textContent = arrayListBanks[i][0];
            option.setAttribute("value", i);
            selectBank.appendChild(option);
        }

        // показываем в информацию по первому банку
        showBank(arrayListBanks, 0);
    }

    // по умолчанию скрываем поле с ошибкой
    hideError();
}


// функция для отображения банка на стр
function showBank(newBank, dataIdBank) {

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


// функция для изминения банка на стр
function changeBank(e) {

    // загружаем текущий список банков и преобразовываем его в массив
    let arrayListBanks = stringToArr(readDataLocalStorga());

    // считываем текущее значение банака с селект
    let valueSelect = e.target.value;

    // очищаем контейнер где была инфа по банку
    clearHTMLContainer(bankList);

    // показываем под селектом информацию по первому банку
    showBank(arrayListBanks, valueSelect);
}

// функция для расчета месячного платежа
function calcMounthlyPayment() {
    let resultMounthlyPayment = '';

    // считываем значения с инпутов, которые ввел пользователь
    let userInitialLoan = document.getElementById('userInitialLoan').value;
    let userDownPayment = document.getElementById('userDownPayment').value;
    let userTotalMouns = document.getElementById('userTotalMouns').value;

    // считываем текущее значение банака с селект
    let bankID = selectBank.value;

    // загружаем текущий список банков и преобразовываем его в массив
    let arrayListBanks = stringToArr(readDataLocalStorga());
    let bankChoseUser = arrayListBanks[bankID];

    // считываем значения с текущего банка (который показан нв стр.)
    let interestRate = parseInt(bankChoseUser[1], 10);
    let maximumLoan = parseInt(bankChoseUser[2], 10);
    let minimumDownPayment = parseInt(bankChoseUser[3], 10);
    let loanTerm = parseInt(bankChoseUser[4], 0);

    // покаскрываем тескт ошибки
    hideError();
    // очищаем поле ответа
    clearHTMLContainer(resultCalc);

    // проверка правильности заполнения полей формы
    if((userInitialLoan >= minimumDownPayment) && (userInitialLoan <= maximumLoan) && (userTotalMouns > 0) && (userTotalMouns <= loanTerm)){
        // подставляем все значения в формулу и делаем расчет
        // ! не забывае перевести процентную ставку в число
        resultMounthlyPayment = ((userInitialLoan-userDownPayment) * (interestRate / 1200) * Math.pow(1 + interestRate / 1200, userTotalMouns)) / (Math.pow(1 + interestRate / 1200, userTotalMouns) - 1);
        resultCalc.innerHTML = resultMounthlyPayment.toFixed(2);
    } else{
        // показываем тескт ошибки если поля были заполнены неправильно
        if(!(userInitialLoan >= minimumDownPayment)){
            showError("Please provide a correct min Initial loan value.");
        }
        if(!(userInitialLoan <= maximumLoan)){
            showError("Please provide a correct max Initial loan value.");
        }
        if(!(userTotalMouns <= loanTerm)){
            showError("Please provide a correct Total months value.");
        }
        if(!(userTotalMouns > 0)){
            showError("Please provide a correct Total months value.");
        }
    }

    return resultMounthlyPayment;
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

function showError(textError){
    messageError.style.display = "block";
    messageError.innerHTML = textError;
}

function hideError(){
    messageError.style.display = "none";
    messageError.innerHTML = ""
}