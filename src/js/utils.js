import ASCIIFolder from 'fold-to-ascii';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearInput(input, fold = false) {
    var result = input.trim().toLowerCase().replace(/\s\s+/g, ' ');
    if (fold) {
        result = ASCIIFolder.fold(result);
    }
    return result;
}

function clearAnswer(answer) {
    return answer.split(';').map(item => item.trim());
}

export default {
    capitalizeFirstLetter: capitalizeFirstLetter,
    getRandomInt: getRandomInt,
    clearInput: clearInput,
    clearAnswer: clearAnswer
}
