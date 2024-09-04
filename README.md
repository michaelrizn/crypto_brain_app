
Проект по прогнозированию цен на криптовалюты с использованием промпт-инжиниринга

Этот проект создан с использованием промпт-инжиниринга и включает прогнозирование цен на криптовалюты Bitcoin (BTC) и Ethereum (ETH). Основная цель проекта — показать, как можно применить искусственный интеллект и машинное обучение (ML) на основе данных из CoinGecko API для создания предсказательных моделей с использованием библиотеки Brain.js. Пользователи могут изменять параметры обучения, такие как количество итераций, нейроны и скорость обучения, и наблюдать результаты прогнозов.

Основные функции:

	•	Получение исторических данных цен на BTC и ETH через CoinGecko API.
	•	Использование рекуррентной нейронной сети LSTM для прогнозирования цен на основе исторических данных.
	•	Регулируемые параметры обучения:
	•	Количество скрытых нейронов (сложность модели).
	•	Количество итераций (глубина обучения).
	•	Скорость обучения (learning rate).
	•	Порог ошибки (допустимая погрешность).
	•	Размер батча (объем данных за один цикл обучения).
	•	Поддержка предсказания изменения цены за следующие 24 часа с возможностью сравнения текущей и предсказанной цены.

Как использовать:

	1.	Склонируйте репозиторий и убедитесь, что все файлы находятся на своих местах.
	2.	Откройте index.html в браузере для запуска проекта.
	3.	Настройте параметры обучения с помощью слайдеров (например, количество нейронов или итераций).
	4.	Нажмите кнопку “Start” для запуска процесса предсказания цен на криптовалюты.
	5.	Результаты будут отображены на экране после завершения прогноза.

Важные моменты:

	1.	В файлах btc_sequences.js и eth_sequences.js обязательно добавьте следующую строку в конце файла, чтобы данные были доступны для использования в браузере:
    window.btcSequences = btcSequences;
    window.ethSequences = ethSequences;

Структура файлов проекта:

	•	index.html: Главная страница, содержащая элементы управления и интерфейс пользователя.
	•	app.js: Основная логика, включая получение данных, обучение модели и вывод результатов.
	•	btc_sequences.js и eth_sequences.js: Исторические данные по криптовалютам, сохраненные в формате JavaScript.
	•	brain.min.js: Библиотека для работы с искусственным интеллектом и машинным обучением.

Логика работы:

	1.	Получение данных: Данные о ценах на криптовалюты (BTC и ETH) загружаются с помощью API CoinGecko. Они нормализуются и используются для обучения модели.
	2.	Настройка параметров: С помощью слайдеров пользователь может задать параметры обучения модели (например, количество итераций и скрытых нейронов).
	3.	Обучение модели: Используется рекуррентная нейронная сеть (LSTM), которая обучается на исторических данных для предсказания следующей цены.
	4.	Прогноз: После обучения модель предсказывает цену на следующие 24 часа, а результаты выводятся на экран, где можно увидеть текущее значение, прогнозируемое значение и процентное изменение.

Этот проект показывает, как с помощью методов промпт-инжиниринга и AI можно построить простой, но эффективный инструмент для анализа и прогнозирования цен на криптовалюты.