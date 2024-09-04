console.log('app.js загружен');

// Функция для получения текущей цены с CoinGecko API
async function getCurrentPrice(coinIds) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`;
    console.log(`Запрос к URL: ${url}`);
    try {
        const response = await fetch(url);
        console.log('Ответ получен:', response);
        const data = await response.json();
        console.log('Данные получены:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при получении цены:', error);
        return null;
    }
}

// Функция для предсказания цены на основе последовательностей
async function predictPrice(sequences, updateProgress) {
    const hiddenNeurons = parseInt(document.getElementById('hidden-neurons').value);
    const iterations = parseInt(document.getElementById('iterations').value);
    const batchSize = parseInt(document.getElementById('batch-size').value);
    const learningRate = parseFloat(document.getElementById('learning-rate').value) / 10000;
    const errorThresh = parseFloat(document.getElementById('error-thresh').value) / 1000;

    const net = new brain.recurrent.LSTMTimeStep({
        inputSize: 1,
        hiddenLayers: [hiddenNeurons],
        outputSize: 1
    });
    const trainingData = sequences.map(seq => seq[0]);
    
    const trainingConfig = {
        iterations: iterations,
        batchSize: batchSize,
        learningRate: learningRate,
        errorThresh: errorThresh
    };

    for (let i = 0; i < trainingConfig.iterations; i += trainingConfig.batchSize) {
        await new Promise(resolve => setTimeout(resolve, 0));
        net.train(trainingData, {
            iterations: trainingConfig.batchSize,
            learningRate: trainingConfig.learningRate,
            errorThresh: trainingConfig.errorThresh
        });
        updateProgress((i + trainingConfig.batchSize) / trainingConfig.iterations * 100);
    }
    
    const lastSequence = sequences[sequences.length - 1][0];
    const prediction = net.run(lastSequence);
    
    const min = Math.min(...lastSequence);
    const max = Math.max(...lastSequence);
    return prediction * (max - min) + min;
}

document.addEventListener('DOMContentLoaded', () => {
    const predictButton = document.getElementById('predict');
    const loadingElement = document.getElementById('loading');
    
    const speedAccuracySlider = document.getElementById('speed-accuracy');
    const hiddenNeuronsSlider = document.getElementById('hidden-neurons');
    const iterationsSlider = document.getElementById('iterations');
    const batchSizeSlider = document.getElementById('batch-size');
    const learningRateSlider = document.getElementById('learning-rate');
    const errorThreshSlider = document.getElementById('error-thresh');

    const hiddenNeuronsValue = document.getElementById('hidden-neurons-value');
    const iterationsValue = document.getElementById('iterations-value');
    const batchSizeValue = document.getElementById('batch-size-value');
    const learningRateValue = document.getElementById('learning-rate-value');
    const errorThreshValue = document.getElementById('error-thresh-value');

    function updateSliders() {
        const speedAccuracy = speedAccuracySlider.value / 100;

        hiddenNeuronsSlider.value = Math.round(15 * (1 - speedAccuracy) + 5);
        iterationsSlider.value = Math.round(450 * speedAccuracy + 50);
        batchSizeSlider.value = Math.round(45 * (1 - speedAccuracy) + 5);
        learningRateSlider.value = Math.round(99 * (1 - speedAccuracy) + 1);
        errorThreshSlider.value = Math.round(99 * (1 - speedAccuracy) + 1);

        updateSliderValues();
    }

    function updateSliderValues() {
        hiddenNeuronsValue.textContent = hiddenNeuronsSlider.value;
        iterationsValue.textContent = iterationsSlider.value;
        batchSizeValue.textContent = batchSizeSlider.value;
        learningRateValue.textContent = (learningRateSlider.value / 10000).toFixed(4);
        errorThreshValue.textContent = (errorThreshSlider.value / 1000).toFixed(3);
    }

    speedAccuracySlider.addEventListener('input', updateSliders);
    hiddenNeuronsSlider.addEventListener('input', updateSliderValues);
    iterationsSlider.addEventListener('input', updateSliderValues);
    batchSizeSlider.addEventListener('input', updateSliderValues);
    learningRateSlider.addEventListener('input', updateSliderValues);
    errorThreshSlider.addEventListener('input', updateSliderValues);

    updateSliders();

    if (predictButton) {
        console.log('Кнопка Start найдена');
        predictButton.addEventListener('click', async () => {
            console.log('Кнопка Start нажата');
            loadingElement.style.display = 'block';
            predictButton.disabled = true;

            try {
                // Получаем текущие цены BTC и ETH
                loadingElement.textContent = 'Получение текущих цен...';
                const prices = await getCurrentPrice('bitcoin,ethereum');

                if (!prices) {
                    throw new Error('Не удалось получить цены');
                }

                const btcCurrentPrice = prices.bitcoin.usd;
                const ethCurrentPrice = prices.ethereum.usd;

                // Предсказываем цены
                loadingElement.textContent = 'Предсказание цены BTC: 0%';
                const btcPredictedPrice = await predictPrice(window.btcSequences, progress => {
                    loadingElement.textContent = `Предсказание цены BTC: ${progress.toFixed(0)}%`;
                });
                
                loadingElement.textContent = 'Предсказание цены ETH: 0%';
                const ethPredictedPrice = await predictPrice(window.ethSequences, progress => {
                    loadingElement.textContent = `Предсказание цены ETH: ${progress.toFixed(0)}%`;
                });

                // Рассчитываем разницу и процентное изменение
                const btcDifference = btcPredictedPrice - btcCurrentPrice;
                const btcPercentChange = (btcDifference / btcCurrentPrice) / 100;

                const ethDifference = ethPredictedPrice - ethCurrentPrice;
                const ethPercentChange = (ethDifference / ethCurrentPrice) / 100;

                // Отображаем результаты
                const btcResultElement = document.getElementById('btc-result');
                const ethResultElement = document.getElementById('eth-result');

                function formatResult(currentPrice, predictedPrice, difference, percentChange) {
                    const signDifference = difference >= 0 ? '+' : '-';
                    const signPercentChange = percentChange >= 0 ? '+' : '-';
                    return `$${currentPrice.toFixed(2)} ${signDifference} $${Math.abs(difference).toFixed(2)} = $${predictedPrice.toFixed(2)} (${signPercentChange}${Math.abs(percentChange).toFixed(4)}%)`;
                }

                btcResultElement.textContent = `BTC: ${formatResult(btcCurrentPrice, btcPredictedPrice, btcDifference, btcPercentChange)}`;
                ethResultElement.textContent = `ETH: ${formatResult(ethCurrentPrice, ethPredictedPrice, ethDifference, ethPercentChange)}`;
            } catch (error) {
                console.error('Ошибка предсказания:', error);
                document.getElementById('btc-result').textContent = 'Error getting BTC data';
                document.getElementById('eth-result').textContent = 'Error getting ETH data';
            } finally {
                loadingElement.style.display = 'none';
                predictButton.disabled = false;
                console.log('Загрузка завершена');
            }
        });
    } else {
        console.error('Кнопка Start не найдена');
    }
});