import React from 'react';
import ASCIIFolder from 'fold-to-ascii';
import Verbs from './verbs';

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var pronouns = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];
var tenses = [
    {
        slug: 'presentIndicative',
        name: 'Indicativo Presente',
        active: true,
        id: 1
    },
    {
        slug: 'pastIndicative',
        name: 'Indicativo Passato Prossimo',
        active: false,
        id: 2
    },
    {
        slug: 'imperfectIndicative',
        name: 'Indicativo Imperfetto',
        active: false,
        id: 3
    },
    {
        slug: 'pluperfectIndicative',
        name: 'Indicativo Trapassato Prossimo',
        active: false,
        id: 4
    },
    {
        slug: 'pastRemoteIndicative',
        name: 'Indicativo Passato Remoto',
        active: false,
        id: 5
    },
    {
        slug: 'pluperfectRemoteIndicative',
        name: 'Indicativo Trapassato Remoto',
        active: false,
        id: 6
    },
    {
        slug: 'futureIndicative',
        name: 'Indicativo Futuro Semplice',
        active: false,
        id: 7
    },
    {
        slug: 'futurePerfectIndicative',
        name: 'Indicativo Futuro Anteriore',
        active: false,
        id: 8
    },
    {
        slug: 'presentSubjunctive',
        name: 'Congiuntivo Presente',
        active: false,
        id: 9
    },
    {
        slug: 'imperfectSubjunctive',
        name: 'Congiuntivo Passato',
        active: false,
        id: 10
    },
    {
        slug: 'pastSubjunctive',
        name: 'Congiuntivo Imperfetto',
        active: false,
        id: 11
    },
    {
        slug: 'pluperfectSubjunctive',
        name: 'Congiuntivo Trapassato',
        active: false,
        id: 12
    },
    {
        slug: 'presentConditional',
        name: 'Condizionale Presente',
        active: false,
        id: 13
    },
    {
        slug: 'pastConditional',
        name: 'Condizionale Passate',
        active: false,
        id: 14
    },
    {
        slug: 'imperative',
        name: 'Imperativo',
        pronouns: [1, 5],
        active: false,
        id: 15
    }
];

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

var Form = React.createClass({
    getInitialState: function () {
        return {
            is_valid: true,
            questionPronoun: '',
            questionVerb: '',
            questionTense: '',
            questionAnswer: '',
            answerIsEmpty: true,
            result: '',
            resultText: '',
            resultAnswer: '',
            resultTranslate: []
        };
    },
    componentDidMount: function () {
        this.updateQuestion();
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.tenses != nextProps.tenses) {
            this.updateQuestion();
        }
    },
    onFieldChange: function (fieldName, e) {
        if (this.state[fieldName] != !e.target.value.trim().length) {
            //noinspection JSCheckFunctionSignatures
            this.setState({[fieldName]: !e.target.value.trim().length});
        }
    },
    onSubmitHandler: function (e) {
        e.preventDefault();
        !this.state.resultText ? this.showAnswer() : this.updateQuestion();
    },
    updateQuestion: function () {
        var active_tenses = this.props.tenses.filter(item => item.active);
        if (!active_tenses.length) {
            //noinspection JSCheckFunctionSignatures
            this.setState({is_valid: false});
            return;
        }
        //noinspection JSUnresolvedVariable
        var random_verb = getRandomInt(0, this.props.verbs.length);
        var random_tense = getRandomInt(0, active_tenses.length);
        var tense = active_tenses[random_tense];
        var random_pronoun = getRandomInt(
            tense.pronouns ? tense.pronouns[0] : 0,
            tense.pronouns ? tense.pronouns[1] : pronouns.length
        );
        //noinspection JSUnresolvedVariable
        var verb_obj = this.props.verbs[random_verb];
        var infinitive = clearInput(verb_obj.verb);
        var answer = verb_obj[tense.slug][random_pronoun];
        var translate = [];
        //noinspection JSUnresolvedVariable
        this.props.translations.forEach(function (item) {
            var t = item.data[infinitive];
            if (t) {
                translate.push({
                    lang: item.lang,
                    name: t
                });
            }
        });
        var state = {
            is_valid: true,
            questionVerb: infinitive.capitalizeFirstLetter(),
            questionPronoun: pronouns[random_pronoun].capitalizeFirstLetter(),
            questionTense: tense.name,
            questionAnswer: clearInput(answer, true),
            answerIsEmpty: true,
            result: '',
            resultText: '',
            resultAnswer: pronouns[random_pronoun].capitalizeFirstLetter() + ' ' + clearInput(answer),
            resultTranslate: translate
        };
        this.setState(state, () => {
            var answer_field = this.inputAnswer;
            answer_field.value = '';
            answer_field.focus();
        });
    },
    showAnswer: function () {
        var answer = clearInput(this.inputAnswer.value, true);
        if (!answer.length) {
            return;
        }
        var is_right = clearAnswer(this.state.questionAnswer).indexOf(answer) != -1;
        //noinspection JSCheckFunctionSignatures
        var state = {
            result: is_right,
            resultText: is_right ? 'Yes!' : 'No!'
        };
        this.setState(state, () => this.button.focus());
        this.props.update(is_right);
    },
    render: function () {
        var translations = this.state.resultTranslate.map(item => {
            //noinspection HtmlUnknownAttribute
            return (
                <span key={item.lang}>
                    <span className="label">{item.lang.toUpperCase()}</span>&nbsp;{item.name}&nbsp;
                </span>
            )
        });
        //noinspection HtmlUnknownAttribute,CheckTagEmptyBody
        return (
            <div>
                {this.state.is_valid &&
                    <form className="form" onSubmit={this.onSubmitHandler}>
                        <div className="callout">
                            <p title="Pronoun">
                                <i className="fi-torsos-male-female"></i>
                                <span>{this.state.questionPronoun}</span>
                            </p>
                            <p title="Verb">
                                <i className="fi-foot"></i>
                                <span>{this.state.questionVerb}</span>
                            </p>
                            <p title="Tense">
                                <i className="fi-clock"></i>
                                <span>{this.state.questionTense}</span>
                            </p>
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="input-group-field"
                                defaultValue=""
                                onChange={this.onFieldChange.bind(this, 'answerIsEmpty')}
                                placeholder="type answer here"
                                disabled={this.state.resultText}
                                ref={input => { this.inputAnswer = input; }}
                                lang="it" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                            <div className="input-group-button">
                                <button
                                    className={'button' + (this.state.resultText ? ' success' : '')}
                                    type="submit"
                                    disabled={!this.state.resultText && this.state.answerIsEmpty}
                                    ref={input => { this.button = input; }}>
                                    {this.state.resultText ? 'Next' : 'Submit'}
                                </button>
                            </div>
                        </div>
                        {this.state.resultText &&
                            <div className={'callout ' + (this.state.result ? 'success' : 'alert')}>
                                <p title="Result">
                                    <i className={'fi-' + (this.state.result ? 'check' : 'x')}></i>
                                    <span>{this.state.resultText}</span>
                                </p>
                                <p title="Full answer">
                                    <i className="fi-pencil"></i>
                                    <span>{this.state.resultAnswer}</span>
                                </p>
                                {this.state.resultTranslate &&
                                    <p title="Translation">{translations}</p>
                                }
                            </div>
                        }
                    </form>
                }
                {!this.state.is_valid &&
                    <div className="callout alert">Select at least one tense</div>
                }
            </div>
        );
    }
});

var Counts = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="small-6 columns">
                    <p>Right</p>
                    <div className="stat">{this.props.counts[0]}</div>
                </div>
                <div className="small-6 columns">
                    <p>Wrong</p>
                    <div className="stat">{this.props.counts[1]}</div>
                </div>
            </div>
        );
    }
});

var Tenses = React.createClass({
    getInitialState: function () {
        return {
            tenses: false,
            links: false
        };
    },
    onCheck: function (e) {
        this.props.update(e.target.value, e.target.checked);
    },
    onToggleTenses: function (e) {
        e.preventDefault();
        //noinspection JSCheckFunctionSignatures
        this.setState({tenses: !this.state.tenses});
    },
    onChangeVerbs: function (params, e) {
        e.preventDefault();
        window.location.hash = `#${params}`;
        location.reload();
    },
    onToggleResources: function (e) {
        e.preventDefault();
        //noinspection JSCheckFunctionSignatures
        this.setState({links: !this.state.links});
    },
    render: function () {
        var data = this.props.tenses;
        if (!data) {
            return null;
        }
        var tenses = data.map(item => {
            //noinspection HtmlUnknownAttribute
            return (
                <div key={item.id}>
                    <label>
                        <input
                            type="checkbox"
                            value={item.id}
                            checked={item.active}
                            onChange={this.onCheck}/>
                        {item.name}
                    </label>
                </div>
            )
        });
        var hash = window.location.hash;
        //noinspection CheckTagEmptyBody
        return (
            <div className="toggles text-center">
                <br/>
                <a
                    className={'button ' + (this.state.tenses ? 'primary' : 'secondary')}
                    onClick={this.onToggleTenses}>
                    Select tenses
                </a>
                <a
                    className={'button ' + (!hash || hash == '#duolingo' ? 'primary' : 'secondary')}
                    onClick={this.onChangeVerbs.bind(this, 'duolingo')}>
                    Duolingo list
                </a>
                <a
                    className={'button ' + (hash == '#swadesh' ? 'primary' : 'secondary')}
                    onClick={this.onChangeVerbs.bind(this, 'swadesh')}>
                    Swadesh list
                </a>
                <a
                    className={'button ' + (hash == '#short' ? 'primary' : 'secondary')}
                    onClick={this.onChangeVerbs.bind(this, 'short')}>
                    Short common list
                </a>
                <a
                    href="https://github.com/Sinkler/italian-verbs-trainer"
                    className="button secondary">
                    <i className="fi-social-github"></i>
                </a>
                <a
                    className={'button ' + (this.state.links ? 'primary' : 'secondary')}
                    onClick={this.onToggleResources}>
                    <i className="fi-link"></i>
                </a>
                {this.state.tenses &&
                    <fieldset className="fieldset text-left">
                        <legend>Select tenses</legend>
                        {tenses}
                    </fieldset>
                }
                {this.state.links &&
                    <p className="links">
                        <a href="https://facebook.github.io/react/" target="_blank">React</a>
                        <a href="https://babeljs.io/" target="_blank">Babel</a>
                        <a href="https://webpack.js.org/" target="_blank">Webpack</a>
                        <a href="http://foundation.zurb.com/" target="_blank">Foundation</a>
                        <a href="http://zurb.com/playground/foundation-icon-fonts-3" target="_blank">Foundation Icon Fonts</a>
                        <a href="https://github.com/mplatt/fold-to-ascii-js" target="_blank">Ascii Folder</a>
                        <a href="http://twitter.github.io/twemoji/" target="_blank">Twemoji</a>
                        <a href="https://icons8.com" target="_blank">Icons8</a>
                    </p>
                }
            </div>
        );
    }
});

var App = React.createClass({
    componentWillMount: function () {
        var hash = window.location.hash;
        if (hash == '#swadesh') {
            Verbs.verbs = Verbs.verbs.filter(item => item.is_swadesh);
        } else if (hash == '#short') {
            Verbs.verbs = Verbs.verbs_short;
        }
    },
    getInitialState: function () {
        return {
            tenses: tenses,
            counts: [0, 0]
        };
    },
    updateForm: function (is_right) {
        var counts = this.state.counts;
        counts[is_right ? 0 : 1]++;
        //noinspection JSCheckFunctionSignatures
        this.setState({counts: counts});
    },
    updateTenses: function (id, is_checked) {
        //noinspection JSCheckFunctionSignatures
        this.setState({
            tenses: this.state.tenses.map(item => {
                if (item.id == id) {
                    item.active = is_checked;
                }
                return item;
            })
        });
    },
    render: function () {
        var flag;
        try {
            /* global twemoji */
            flag = twemoji.parse('&#x1f1ee;&#x1f1f9;', {size: 32});
        } catch (e) {
            flag = '';
        }
        //noinspection CheckTagEmptyBody,HtmlUnknownAttribute
        return (
            <div className="row">
                <div className="small-12 large-7 large-centered columns">
                    <div className="text-center">
                        <h1><span dangerouslySetInnerHTML={{__html: flag}}></span> Italian Verbs Trainer</h1>
                    </div>
                    <Form
                        verbs={Verbs.verbs}
                        translations={Verbs.translations}
                        tenses={this.state.tenses}
                        update={this.updateForm}/>
                    <Counts
                        counts={this.state.counts}/>
                    <Tenses
                        tenses={this.state.tenses}
                        update={this.updateTenses}/>
                </div>
            </div>
        );
    }
});

export default App;
