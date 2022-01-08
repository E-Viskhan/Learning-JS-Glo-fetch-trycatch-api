// Функция фильтрации: получает тип, и все остаточные переменные
// остаточные переменные мы собираем в массив с помощью rest оператора
// Далее перебираем каждое значение в данном массиве и фильтруем 
// сравнивая тип текущего value с type, который мы выбрали на странице для фильтрации

// Один const для всех функций?) Выглядит странно, если честно

const filterByType = (type, ...values) => values.filter(value => typeof value === type),


	// Функция для скрытия всех блоков 
	hideAllResponseBlocks = () => {
		// Получем все div: об ошибке, о результате, и об отсутствии результата фильтрации - все
		// Не совсем понятен Array.from потому что наш querySelectorAll и так возвращает NodeList
		// И без Array.from все прекрасно работает, я проверил
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// Перебираем каждый блок и скрываем
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// Функция для смены показываемых блоков
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// 1. Скрыть все блоки
		hideAllResponseBlocks();
		// 2. Показать нужный блок
		document.querySelector(blockSelector).style.display = 'block';
		// 3. Если блок с текстовым содержимым
		if (spanSelector) {
			//то выведи этот текст в textContent
			document.querySelector(spanSelector).textContent = msgText;
		}
	},

	// Функция вывода ошибок на страницу, а ошибок могут возникнуть очень легко из-за eval
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	// Функция вывода сообщения результата, которого также содержит отфильтрованные элементы
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	// Функция для скрытия всех блоков, кроме блока об отстуствии результата
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// Некий декоратор для функции фильтраии выполняет функцию перевода обычного текста 
	// в сущности разных типов js
	tryFilterByType = (type, values) => {
		// Оборачиваем код в try, чтобы код не, дай Бог, не выдал нам ошибку, и не остановил работу
		// всего js кода
		try {
			// Вызываем функцию фильтрации через eval, которая выполняет строку как js код
			// функция фильтрации получает опять же фильтруемый тип и все значения
			// отходя от сути, на бэкенде за такое точно башку оторвут, но ладно, поехали дальше)
			// но по всей видимости это сделано чтобы каждое значение из values, превратилось в свой тип в js
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");

			// valuesArray может быть пустым, если данных этого типа не было в строке
			// формируем ответ, в зависимости от пустоты или заполненности
			// проверку мы выполняем через тернарный оператор
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;

			// Вызываем функцию показа результатов, куда передаем строку результата,
			// или строку что такого типа данных нет в строке
			showResults(alertMsg);

			// получаем ошибки, если они возникают в блоке try
		} catch (e) {
			// Вызываем метод вывода ошибок, который за свою вложенную цепочку вызовов дает нам вывод
			// ошибки на страницу: 1. скрыть все блоки. 2. показать блок с ошибкой и с текстом ошибки внутри
			showError(`Ошибка: ${e}`);
		}
	};

// Получаем кнопку с текстом "Фильтровать" со страницы с помощью селектора, в данном случае с помощью id
const filterButton = document.querySelector('#filter-btn');

// Вещаем на кнопку фильтрации обработчик события слика, и передаем в обработчик event
filterButton.addEventListener('click', e => {

	// Получаем input с результирующим типом
	const typeInput = document.querySelector('#type');

	// получаем input в которой в перемешку лежат наши входные данные
	const dataInput = document.querySelector('#data');

	// Если входная строка пуста, делаем следующее:
	if (dataInput.value === '') {

		// Выводим свое,"кастомное" сообщение об ошибке данного поля, оно отображается только при submit`e
		dataInput.setCustomValidity('Поле не должно быть пустым!');

		// Вызываем функцию showNoResults, в результате мы получаем скрытие всех блоков с response,
		// потому что опять же у нас входная строка пуста, и нет response
		// и соотвественно делаем видимым блок "пока что нечего показать"
		showNoResults();

		// но если у нас входная строка не пуста, делаем следующее:
	} else {
		// сбрасываем наше сообщение валидации, так как сейчас все ок, и жаловаться не на что
		dataInput.setCustomValidity('');

		// отменяем стандартную реакцию на event, то есть отменяем обработку события submit
		e.preventDefault();

		// передаем входные данные для фильтрации, срезая пробелы по границам:
		// 1. На что нужно фильтровать
		// 2. Собственно то, что фильтруем
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});