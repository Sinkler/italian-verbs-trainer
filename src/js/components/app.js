import React from 'react';
import PronounsList from '../pronouns';
import TensesList from '../tenses';
import Verbs from '../verbs';
import Form from '../containers/form'
import Counts from '../containers/counts'
import Footer from '../containers/footer'

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
            tenses: TensesList,
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
                        pronouns={PronounsList}
                        verbs={Verbs.verbs}
                        translations={Verbs.translations}
                        tenses={this.state.tenses}
                        update={this.updateForm}/>
                    <Counts
                        counts={this.state.counts}/>
                    <Footer
                        tenses={this.state.tenses}
                        update={this.updateTenses}/>
                </div>
            </div>
        );
    }
});

export default App;
