import ASCIIFolder from 'fold-to-ascii';

function capitalizeFirstLetter(string) {
    //noinspection JSUnresolvedFunction
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearInput(input, fold = false, replace_pronoun = '') {
    var result = input.trim().toLowerCase().replace(/\s\s+/g, ' ');
    if (replace_pronoun) {
        replace_pronoun.toLowerCase().split('/').forEach(item => {
            var find = item + ' ';
            if (result.startsWith(find)) {
                result = result.replace(find, '');
            }
        });
    }
    if (fold) {
        result = ASCIIFolder.fold(result);
    }
    return result;
}

function clearAnswer(answer) {
    var answers = answer.split(';').map(item => item.trim());
    if (answers && answers[0].indexOf(' ') != -1) {
        var new_answers = [];
        answers.forEach(item => new_answers.push(item.substr(0, item.length - 1)));
        answers = answers.concat(new_answers);
    }
    return answers;
}

export default {
    capitalizeFirstLetter: capitalizeFirstLetter,
    getRandomInt: getRandomInt,
    clearInput: clearInput,
    clearAnswer: clearAnswer
}
