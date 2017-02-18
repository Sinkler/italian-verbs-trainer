import React from 'react';
import Utils from '../utils';

class Form extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
    }
    componentDidMount() {
        this.updateQuestion();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.tenses != nextProps.tenses) {
            this.updateQuestion(false);
        }
    }
    onFieldChange(fieldName, e) {
        if (this.state[fieldName] != !e.target.value.trim().length) {
            this.setState({[fieldName]: !e.target.value.trim().length});
        }
    }
    onSubmitHandler(e) {
        e.preventDefault();
        !this.state.resultText ? this.showAnswer() : this.updateQuestion();
    }
    updateQuestion(autofocus = true) {
        var active_tenses = this.props.tenses.filter(item => item.active);
        if (!active_tenses.length) {
            this.setState({is_valid: false});
            return;
        }
        var random_verb = Utils.getRandomInt(0, this.props.verbs.length);
        var random_tense = Utils.getRandomInt(0, active_tenses.length);
        var tense = active_tenses[random_tense];
        var verb_obj = this.props.verbs[random_verb];
        var answers = verb_obj[tense.slug];
        if (tense.prepend) {
            answers = tense.prepend.concat(answers)
        }
        var random_pronoun = Utils.getRandomInt(
            tense.pronouns ? tense.pronouns[0] : 0,
            tense.pronouns ? tense.pronouns[1] : this.props.pronouns.length
        );
        if (verb_obj.verb in this.props.exceptions) {
            random_pronoun = this.props.exceptions[verb_obj.verb](random_pronoun);
        }
        var answer = answers[random_pronoun];
        var translate = [];
        var pronoun = this.props.pronouns[random_pronoun];
        var infinitive = Utils.clearInput(verb_obj.verb);
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
            questionVerb: Utils.capitalizeFirstLetter(infinitive),
            questionPronoun: pronoun,
            questionTense: tense.name,
            questionAnswer: Utils.clearInput(answer, true),
            answerIsEmpty: true,
            result: '',
            resultText: '',
            resultAnswer: pronoun + ' ' + Utils.clearInput(answer),
            resultTranslate: translate
        };
        this.setState(state, () => {
            if (!autofocus) {
                return;
            }
            var answer_field = this.inputAnswer;
            answer_field.value = '';
            answer_field.focus();
        });
    }
    showAnswer() {
        var answer = Utils.clearInput(this.inputAnswer.value, true, this.state.questionPronoun);
        if (!answer.length) {
            return;
        }
        var cleared = Utils.clearAnswer(this.state.questionAnswer);
        var first = cleared.indexOf(answer) != -1;
        var second = cleared.indexOf(answer.substr(0, answer.length - 1)) != -1;
        var is_right = first || second;
        var state = {
            result: is_right,
            resultText: is_right ? 'Yes!' : 'No!'
        };
        this.setState(state, () => this.button.focus());
        this.props.update(is_right);
    }
    render() {
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
                    <form className="form" onSubmit={this.onSubmitHandler.bind(this)}>
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
}

export default Form;
