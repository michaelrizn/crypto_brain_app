
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

	•	index.html: Главная страница.
	•	app.js: Логика загрузки данных, обучения модели и отображения результатов.
	•	btc_sequences.js, eth_sequences.js: Исторические данные по криптовалютам.
	•	brain.min.js: Библиотека машинного обучения.

Логика работы:

	1.	Данные загружаются через API CoinGecko и нормализуются.
	2.	Пользователь настраивает параметры обучения через слайдеры.
	3.	Модель обучается и предсказывает будущие цены на основе исторических данных.
	4.	Результаты отображаются в формате: текущее значение, прогноз, разница и процентное изменение.

Код для Kaggle:

```python
# 1. Импорт библиотек
import requests
import pandas as pd
import json

# 2. Список криптовалют
cryptocurrencies = [
    {'id': 'bitcoin', 'name': 'btc'},
    {'id': 'ethereum', 'name': 'eth'}
]

# 3. Функция для получения данных с CoinGecko
def get_data(coin_id, vs_currency='usd', days=365):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {'vs_currency': vs_currency, 'days': days}
    response = requests.get(url, params=params)
    data = response.json()
    return pd.DataFrame(data['prices'], columns=['timestamp', 'price'])

# 4. Функция для создания последовательностей
def create_sequences(data, seq_length=60):
    sequences = []
    for i in range(len(data) - seq_length):
        seq = data.iloc[i:i + seq_length]['price_normalized'].values.tolist()
        label = data.iloc[i + seq_length]['price_normalized']
        sequences.append((seq, label))
    return sequences

# 5. Функция для сохранения данных в JS файлы
def save_sequences_to_js(sequences, var_name, filename):
    js_content = f"export const {var_name} = {json.dumps(sequences)};"
    with open(filename, 'w') as f:
        f.write(js_content)

# 6. Функция для сохранения данных в JSON файлы
def save_sequences_to_json(sequences, filename):
    with open(filename, 'w') as f:
        json.dump(sequences, f)

# 7. Подготовка данных для каждой криптовалюты
for crypto in cryptocurrencies:
    data = get_data(crypto['id'], 'usd', 365)
    data['timestamp'] = pd.to_datetime(data['timestamp'], unit='ms')
    data['price_normalized'] = (data['price'] - data['price'].min()) / (data['price'].max() - data['price'].min())
    
    sequences = create_sequences(data)
    
    # Сохранение в JS файл
    save_sequences_to_js(sequences, f"{crypto['name']}Sequences", f"{crypto['name']}_sequences.js")
    
    # Сохранение в JSON файл
    save_sequences_to_json(sequences, f"{crypto['name']}_sequences.json")

# 8. Вывод сообщения о завершении
print("Данные успешно сохранены для всех криптовалют.")
```

Этот код загружает исторические данные для BTC и ETH, нормализует их, создает последовательности для обучения модели, а затем сохраняет данные в файлы .js и .json.