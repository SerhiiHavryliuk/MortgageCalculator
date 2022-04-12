// ------------------------------------------------------------------------------
// Переменные
// ------------------------------------------------------------------------------

const form = document.querySelector('form'); // форма

// кнопки
const btnAddNewBank = document.getElementById("btnAddNewBank");
const btnEditNewBank = document.getElementById("btnEditNewBank");
const btnSaveNewBank = document.getElementById("btnSaveNewBank");
const btnClear = document.querySelector('.clear'); // кнопка для очистки талицы банков

const bankList = document.querySelector('.bank-list'); // контейнер куда будем добавлять впиок банков
const arrInputsValuesForm = document.querySelectorAll('.inputNewBank'); // динамический список всех всех инпутов формы
const localStoreListBanks = "banksData"; // название переменной в localStorage, куда записываем все данные банков

let arrListOfBanks = []; // массив в котором сохраняем список банков
let arrEditBank = [];// переменная в которой будем хранить измененные данные банка
let editIdBank = '';


// ------------------------------------------------------------------------------
// Функции
// ------------------------------------------------------------------------------

// Функция преобразования массива в строку
function arrToString(arr) {
    return JSON.stringify(arr)
}

// Функция преобразования строки в массив
function stringToArr(string) {
    return JSON.parse(string)
}

// Функция для считывания данных с localStorage
// считываем значение 'localStoreListBanks'
function readDataLocalStorga() {
    return localStorage.getItem(localStoreListBanks);
}

// Функция для считывания записи данных в localStorage
// записываем в значение 'localStoreListBanks'
function saveDataLocalStorga(stringDataBanks) {
    localStorage.setItem(localStoreListBanks, stringDataBanks);
}

// Функция для создания таблички банков
function showTableBanks(arrBanks) {
    arrBanks.forEach((item, index) => {
        addNewBank(item, index);
    });
}

// Функция для удаления банка
function deleteBank(arrBanks, indexDeleteBank) {
    const newArrBanks = [];

    return newArrBanks;
}

// Функция для добавления банка
function addNewBank(newBank, dataIdBank) {

    // Создаем элемент списка куда будет помещатся вся инфа про банк
    const li = document.createElement('li');

    // Сздаем 5 ячеек и помещаем туда информацию о банке
    for (let i = 0; i < newBank.length; i++) {
        const cell = document.createElement('p');
        cell.textContent = newBank[i];
        li.appendChild(cell);
    }

    // создаем кнопку редактирования
    const btnEditBank = document.createElement('button');
    btnEditBank.textContent = "edit"
    btnEditBank.setAttribute("class", 'editBank');

    // создаем кнопку удаления
    const btnDeleteBank = document.createElement('button');
    btnDeleteBank.textContent = "delete";
    btnDeleteBank.setAttribute("class", 'deleteBank');

    // вставляем кнопки
    li.appendChild(btnEditBank);
    li.appendChild(btnDeleteBank);

    // устанавливаем id атрибут (нужен чтобы вычислять элемент который хочем удалить или редактировать)
    li.setAttribute("data-id", dataIdBank);

    // добавляем готовый элемент в контейнер на стр
    bankList.appendChild(li);
}

// Функция для считывания значений в инпутах 
// возвращает массив всех значений
function readDataForm() {
    const arrDataBank = [];
    arrInputsValuesForm.forEach((nodeInput) => {
        arrDataBank.push(nodeInput.value);
    });
    return arrDataBank;
}

// Функция для очистки значений в инпутах
function clearDataForm() {
    arrInputsValuesForm.forEach((nodeInput) => {
        nodeInput.value = '';
    });
}

function clearLocalStorage(){
    localStorage.clear();
    while (bankList.firstChild) {
        bankList.removeChild(bankList.firstChild);
    }
    arrListOfBanks = [];
}


// ------------------------------------------------------------------------------
// Обработчики событий
// ------------------------------------------------------------------------------

// при первом старте скрипта проверяем localStorage и формируем массив для заполнения таблицы
// если ничего нет то указывае пустой массив
window.addEventListener('load', function () {
    let data = [];

    // проверка наличия в localStore списка банков
    if (localStorage.getItem(localStoreListBanks)) {
        // считываем значение с LocalStorage
        let currentArrBanks = readDataLocalStorga();
        // преобразовываем строку в массив и перезаписываем массив с новыми значениями
        arrListOfBanks = stringToArr(currentArrBanks);
        // показываем список банков на стр с новыми значениями  
        showTableBanks(arrListOfBanks);
    } 

})

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Считываем значения с инпутов и формируем массив для добавления в LocalStorage
    let arrDataNewBank = readDataForm();
    let idBank = '';

    arrListOfBanks.push(arrDataNewBank);   
    idBank = arrListOfBanks.length - 1
    localStorage.setItem(localStoreListBanks, JSON.stringify(arrListOfBanks));
    addNewBank(arrDataNewBank, idBank);

    //очистка полей
    clearDataForm();

    //закрываем модальное окно
    modal.style.display = "none";
});



// Очистка localStorage
// btnClear.addEventListener('click', function () {
//     clearLocalStorage();
// });


// в контейне таблицы отслеживаем два события
// 1 событие - удаление банка (когда был клик по кнопке с классом "deleteBank")
// 2 событие - редактирование банка (когда был клик по кнопке с классом "editBank")
bankList.addEventListener('click', function (e) {

    // 1 событие - удаление банка
    if (e.target.classList.contains("deleteBank")) {
        let arrIdBank = e.target.parentNode.getAttribute('data-id');
        
        // считываем значение с LocalStorage
        let currentArrBanks = readDataLocalStorga();
        // преобразовываем строку в массив и перезаписываем массив с новыми значениями
        arrListOfBanks = stringToArr(currentArrBanks);

        // удаляем банк с определенным индексом
        arrListOfBanks.splice(arrIdBank,1);

        // Записываем значение в localStorage
        // преобразовываем массив в строку
        let newArrListBanks = arrToString(arrListOfBanks);
        saveDataLocalStorga(newArrListBanks);

        // clearLocalStorage() container;
        while (bankList.firstChild) {
            bankList.removeChild(bankList.firstChild);
        }
        
        // перерисовіваем список банков на стр с новыми значениями  
        showTableBanks(arrListOfBanks);
   
    }

    // 2 событие - редактирование банка
    if (e.target.classList.contains("editBank")) {
 
        // показываем модальное окно
        showModal();
        
        //получаем id банка который нужно редактировать
        editIdBank  = e.target.parentNode.getAttribute('data-id');

        // считываем значение с LocalStorage
        let currentArrBanks = readDataLocalStorga();

        // преобразовываем строку в массив и перезаписываем массив с новыми значениями
        arrListOfBanks = stringToArr(currentArrBanks);

        // извлекаем банк с определенным индексом
        arrEditBank = arrListOfBanks[editIdBank];

        // заполняем поля форми из локалсторедж
        arrInputsValuesForm.forEach((nodeInput,index) => {
            nodeInput.value = arrEditBank[index];
        });

        // скрываем кнопку ОК показываем кнопку EDIT
        btnEditNewBank.style.display = "block";
        btnSaveNewBank.style.display = "none";
    }
})


btnEditNewBank.addEventListener('click',function(e){
    e.preventDefault();

    // вызываем функцию для редактирования банка и передаем необходимые парпметрф
    editBank(arrEditBank, editIdBank);
})

// Функция для редактирования банка
function editBank( arrEditBank, indexEditBank) {

    // считываем значение с LocalStorage
    let currentArrBanks = readDataLocalStorga();

    // преобразовываем строку в массив и перезаписываем массив с новыми значениями
    arrListOfBanks = stringToArr(currentArrBanks);

    // Считываем значения с инпутов и формируем массив для добавления в LocalStorage
    let arrDataNewBank = readDataForm();

    // // перезаписываем основной массив
    arrListOfBanks[indexEditBank] = arrDataNewBank;

    // преобразовываем массив в строку
    let newEditedArr = arrToString(arrListOfBanks);
    // добавляем данные в локалСтор
    saveDataLocalStorga(newEditedArr);

    // перегружаем стр для обновления данных
    document.location.reload();

    // закрываем модальное окно
    hideModal();
}


// -------------------------------------------------------------------------------
// Модальное окно
// ------------------------------------------------------------------------------
// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btnOpenModal = document.getElementById("btnAddNewBank");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btnOpenModal.addEventListener('click', function () {
    showModal();
})

// When the user clicks on <span> (x), close the modal
span.addEventListener('click', function () {
    hideModal();
})

function showModal(){
    modal.style.display = "block";
}

function hideModal(){
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }