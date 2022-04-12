// ------------------------------------------------------------------------------
// Переменные
// ------------------------------------------------------------------------------

const selectBank = document.querySelector('.selectBank'); // select

// ползунки
const inputInitialLoan = document.querySelector('.inputInitialLoan');
const inputDownPayment = document.querySelector('.inputDownPayment');
const inputTotalMouns = document.querySelector('.inputTotalMouns');

const btnCalc = document.querySelector('.btnCalc'); // кнопка calc
const resultCalc = document.querySelector('.resultCalc'); // контейнер куда будем вставлять  результат расчетов
const localStoreListBanks = "banksData"; // название переменной в localStorage, куда записываем все данные банков
const bankList = document.querySelector('.bankInfo');// контейнер куда будем вставлять данные выбраного банка


// ------------------------------------------------------------------------------
// Обработчики событий
// ------------------------------------------------------------------------------

window.addEventListener('load', init);// в init выполняем первоначальнуюинициализацию данных на странице
selectBank.addEventListener('change', changeBank); // отслеживаем изменения банка в компоненте select

// отслеживаем изменения значений в ползунках
inputInitialLoan.addEventListener('change', changeValue);
inputDownPayment.addEventListener('change', changeValue);
inputTotalMouns.addEventListener('change', changeValue);

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

        // устанавливаем значения ползунков из выбраного банка
        setValuesInputsRang()
    }
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

    // устанавливаем парметры в ползунки с данных банка
    setValuesInputsRang();

    // устанавливаем первоначальные значения в ползунках и показываем значения
    setCurrentValueInRange();
}


// функция меняем значение взависимости от изменений на ползунке
function changeValue(e) {
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
    let interestRate = bankChoseUser[1];
    let maximumLoan = bankChoseUser[2];
    let minimumDownPayment = bankChoseUser[3];
    let loanTerm = bankChoseUser[4];

    // подставляем все значения в форму
    resultMounthlyPayment = (userInitialLoan * (interestRate / 12) * Math.pow(1 + interestRate / 12, userTotalMouns)) / (Math.pow(1 + interestRate / 12, userTotalMouns) - 1);
    resultCalc.innerHTML = resultMounthlyPayment.toFixed(2);

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

// устанавливаем максимальное и минимально значение в ползунках в зависимости отвыбраного банка
function setValuesInputsRang() {

    // считываем текущее значение банака с селект
    let bankID = selectBank.value;

    // загружаем текущий список банков и преобразовываем его в массив
    let arrayListBanks = stringToArr(readDataLocalStorga());
    let bankChoseUser = arrayListBanks[bankID];

    // считываем значения с текущего банка (который показан нв стр.)
    let interestRate = bankChoseUser[1];
    let maximumLoan = bankChoseUser[2];
    let minimumDownPayment = bankChoseUser[3];
    let loanTerm = bankChoseUser[4];

    // заменяем максимальное значение в ползунках
    // устанавливаем максимальную сумму кредита
    document.getElementById('userInitialLoan').setAttribute("max", maximumLoan);

    // устанавливаем минимальный первоначальный взнос
    document.getElementById('userDownPayment').setAttribute("min", minimumDownPayment);

    // устанавливаем максимальный первоначальный взнос = максимальную сумму кредита
    document.getElementById('userDownPayment').setAttribute("max", maximumLoan);

    // устанавливаем максималное кол-во месяцев кредита
    document.getElementById('userTotalMouns').setAttribute("max", loanTerm);

    // устанавливаем первоначальные значения в ползунках и показываем значения
    setCurrentValueInRange();
}

// устанавливаем первоначальные значения в ползунках и показываем значения
function setCurrentValueInRange() {
    document.getElementById('valueInitialLoan').innerHTML = inputInitialLoan.getAttribute('min');
    document.getElementById('valueDownPayment').innerHTML = userDownPayment.getAttribute('min');
    document.getElementById('valueTotalMouns').innerHTML = inputDownPayment.getAttribute('min');
}