$(document).ready(function() {
    $('#convertButton').click(function() {
        var temperature = parseFloat($('#temperatureInput').val());
        var unit = $('#unitInput').val();
        var convertedTemperature = {};
        var resultText = '';

        if (isNaN(temperature)) {
            $('#result').html('<div class="alert alert-danger">Please enter a valid number</div>');
            return;
        }

        switch (unit) {
            case 'Celsius':
                convertedTemperature.Fahrenheit = (temperature * 9/5) + 32;
                convertedTemperature.Kelvin = temperature + 273.15;
                resultText = `${temperature} °C is equal to ${convertedTemperature.Fahrenheit.toFixed(2)} °F and ${convertedTemperature.Kelvin.toFixed(2)} K`;
                break;
            case 'Fahrenheit':
                convertedTemperature.Celsius = (temperature - 32) * 5/9;
                convertedTemperature.Kelvin = (temperature - 32) * 5/9 + 273.15;
                resultText = `${temperature} °F is equal to ${convertedTemperature.Celsius.toFixed(2)} °C and ${convertedTemperature.Kelvin.toFixed(2)} K`;
                break;
            case 'Kelvin':
                convertedTemperature.Celsius = temperature - 273.15;
                convertedTemperature.Fahrenheit = (temperature - 273.15) * 9/5 + 32;
                resultText = `${temperature} K is equal to ${convertedTemperature.Celsius.toFixed(2)} °C and ${convertedTemperature.Fahrenheit.toFixed(2)} °F`;
                break;
        }

        $('#result').html(`<div class="alert alert-success">${resultText}</div>`);
    });
});
