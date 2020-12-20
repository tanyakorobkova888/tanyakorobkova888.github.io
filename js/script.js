'use strict';

// ======== Functions for Events ========
function addBook() { 
    //Оъявление переменных
    let timeElement = document.querySelector('#time'),
        dayElement = document.querySelector('#day'),
        roomElement = document.querySelector('#room'),
        speakerName = document.querySelector('#name'),
        description = document.querySelector("#description"),
        color = document.querySelector('#color');
    
    //Проверка пустых значений
    if (speakerName.value == "") {
        alert('Заполните поле: "Имя"');
        return false;
    } 
    if (description.value == "") {
        alert('Заполните поле: "Описание Startup проекта"!');
        return false;
    } 
    //Запрос нужной ячейки
    let req = '.' + dayElement.value + ' ' + '.' + roomElement.value + ' ' + '.' + timeElement.value;
    let cellOfTable = document.querySelector(req); 
    
    //Проверка занятости ячейки
    if (cellOfTable.style.backgroundColor != '') {
        alert('Это время уже занято!');
        return;
    }

    //Цвет
    cellOfTable.style.backgroundColor = color.value;

    //Описание
    let descriptionText = document.createElement('p');
    descriptionText.innerText = description.value;
    descriptionText.style.display = 'none';
    descriptionText.className = 'description';
    cellOfTable.appendChild(descriptionText);

    //Имя
    let nameText = document.createElement('h5');
    nameText.innerText = speakerName.value;
    cellOfTable.appendChild(nameText);

    //Создаем объект для LocalStorage
    let infoOfCell = {
        name: speakerName.value,
        description: description.value,
        color: color.value,
        weekNumber: (new Date()).getWeek()
    };
    let serializedInfo = JSON.stringify(infoOfCell);
    localStorage.setItem(req, serializedInfo);

    //Модальное окно
    cellOfTable.addEventListener('click', function(event) {
        let modal = document.querySelector(".modal");
        let about = document.querySelector('#about');
        let span = document.querySelector(".close_modal_window");
        let textForAbout;
        
        //Проверка куда кликнули (на слово или пустое место)
        if (event.target.getElementsByClassName('description').length > 0) {
            //Обработка клика на пустое место: ищем в html-элементе нужный <p> и берем из него текст
            textForAbout = event.target.getElementsByClassName('description')[0].innerText;
        }
        else {
            //Обработка клика на текст: ищем в родительском html-элементе нужный <p>
            textForAbout = event.target.parentElement.getElementsByClassName('description')[0].innerText;
        }

        //Показ модального окна
        modal.style.display = "block";
        about.innerText = textForAbout;
        
        //Закрытие модального окна
        span.onclick = function () {
            modal.style.display = "none";
        }
    });
}

//Удаление бронирования
function removeBook() {
    let timeElement = document.querySelector('#time'),
        dayElement = document.querySelector('#day'),
        roomElement = document.querySelector('#room');

    //Проверка перед удалением
    let askUser = confirm('Вы уверены?');
    if (askUser == true) {
        //Выбор нужной ячейки
        let request = '.' + dayElement.value + ' ' + '.' + roomElement.value + ' ' + '.' + timeElement.value;
        let cell = document.querySelector(request);

        //Проверка на пустоту
        if (cell.style.backgroundColor != '') {
            //Очистка
            cell.style.backgroundColor = '';
            cell.innerText = '';
            localStorage.removeItem(request);
            return true;
        } else {
            alert('Здесь ничего нет!');
            return false;
        }
    } else {
        return false;
    }
}

//Изменить бронирование
function changeBook() {
    let result = removeBook();
    if (result == true) {
        addBook();
    }
}

// ======== Events ========
let btnBook = document.querySelector('button'); 

btnBook.addEventListener('click', function() {
    let editBook = document.querySelector('#edit');
    
    switch(editBook.value) {
        case 'add':
            addBook();
            break;
        case 'edit':
            changeBook();
            break;
        case 'remove':
            removeBook();
            break;
        default:
            alert('ERROR: unknown type of booking. ' + editBook.value);
    }
});

// ======== Functions ========
//Создание таблицы
function initTable () {
    let days = ['monday' , 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let ruDays = ['ПН' , 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    let time = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    let innerTime = ['time9', 'time10', 'time11', 'time12', 'time13', 'time14', 'time15', 'time16', 'time17', 'time18'];
    let innerRoom = ['room-1', 'room-2'];
    let room = ['Комната 1', 'Комната 2'];

    let week = document.querySelector('.week');
    //Создание каждой таблицы по дням недели
    for (let k = 0; k < days.length; k++) {
        let table = document.createElement('table');
        table.classList.add(days[k]);

        //Создание главной строки таблицы
        let rowInfo = document.createElement('tr');
        let tdMonday = document.createElement('td');
        tdMonday.innerText = ruDays[k];
        tdMonday.style.backgroundColor = '#5f5d5d';
        rowInfo.appendChild(tdMonday);
        for (let i = 0; i < time.length; i++) {
            let td = document.createElement('td');
            td.innerText = time[i];
            td.style.backgroundColor = '#5f5d5d';
            rowInfo.appendChild(td);
        }
        table.appendChild(rowInfo);

        //Добавление строчек для каждой комнаты
        for (let i = 0; i < room.length; i++) {
            let tr = document.createElement('tr');
            tr.classList.add(innerRoom[i]);

            let tdRoom = document.createElement('td');
            tdRoom.innerText = room[i];
            tdRoom.style.backgroundColor = '#5f5d5d';
            tr.appendChild(tdRoom);
            //Добавление ячеек на каждое время
            for(let j = 0; j < time.length; j++) {
                let td = document.createElement('td');
                td.classList.add(innerTime[j]);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        week.appendChild(table);
    }
};

//Показ данных из LocalStorage
function showItemsFromStorage() {
    let removeList = [];

    //Цикл по объектам LocalStorage
    for(let i = 0; i < localStorage.length; i++) {
        //Получаем ячейку по ключу
        let key = localStorage.key(i);
        let cellOfTable = document.querySelector(key); 

        //Конвертируем объект из JSON
        let itemJSON = localStorage.getItem(key);
        let item = JSON.parse(itemJSON);

        //Проверка на номер текущей недели
        if (item.weekNumber == (new Date()).getWeek()) {
            //Заполняем ячейку информацией из LocalStorage
            //Добавление описания
            let descriptionText = document.createElement('p');
            descriptionText.innerText = item.description;
            descriptionText.style.display = 'none';
            descriptionText.className = 'description';
            cellOfTable.appendChild(descriptionText);
            //Добавляем имя
            let nameText = document.createElement('h5');
            nameText.innerText = item.name;
            cellOfTable.appendChild(nameText);
            //Цвет
            cellOfTable.style.backgroundColor = item.color;
            //Вызов модального окна
            cellOfTable.addEventListener('click', function(event) {
                let modal = document.querySelector(".modal");
                let about = document.querySelector('#about');
                let span = document.querySelector(".close_modal_window");
                
                let textForAbout;
                //Проверка куда кликнули (на слово или пустое место)
                if (event.target.getElementsByClassName('description').length > 0) {
                    //Обработка клика на пустое место: ищем в html-элементе нужный <p> и берем из него текст
                    textForAbout = event.target.getElementsByClassName('description')[0].innerText;
                }
                else {
                    //Обработка клика на текст: ищем в родительском html-элементе нужный <p>
                    textForAbout = event.target.parentElement.getElementsByClassName('description')[0].innerText;
                }
                //Показ модального окна
                modal.style.display = "block";
                about.innerText = textForAbout;
                span.onclick = function () {
                    //Закрытие модального окна
                    modal.style.display = "none";
                }
            });
        } else {
            //Добавляем ключ в массив для удаления
            removeList.push(key);
        }
    }
    //Удаление объектов из LocalStorage по ключам
    for(let i = 0; i < removeList.length; i++) {
        let key = removeList[i];
        localStorage.removeItem(key);
    }
}

//Получение номера текущей недели
Date.prototype.getWeek = function() {
    let onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
// ========== Main ==========
initTable();
showItemsFromStorage();

