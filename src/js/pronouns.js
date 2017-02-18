function only_third(pronoun) {
    return [0, 1, 2].indexOf(pronoun) != -1 ? 2 : 5;
}

export default {
    list: ['Io', 'Tu', 'Lui/Lei', 'Noi', 'Voi', 'Loro'],
    exceptions: {
        piovere: only_third
    }
};
