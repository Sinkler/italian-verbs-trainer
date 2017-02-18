import React from 'react';
import Pronouns from '../pronouns';
import TensesList from '../tenses';
import Verbs from '../verbs';
import Form from '../containers/form'
import Counts from '../containers/counts'
import Footer from '../containers/footer'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tenses: TensesList,
            counts: [0, 0]
        };
    }
    //noinspection JSMethodCanBeStatic
    componentWillMount() {
        var hash = window.location.hash;
        if (hash == '#swadesh') {
            Verbs.verbs = Verbs.verbs.filter(item => item.is_swadesh);
        } else if (hash == '#short') {
            Verbs.verbs = Verbs.verbs_short;
        }
    }
    updateForm(is_right) {
        var counts = this.state.counts;
        //noinspection JSCheckFunctionSignatures
        this.setState({counts: [
            is_right ? counts[0] + 1 : counts[0],
            is_right ? counts[1] : counts[1] + 1
        ]});
    }
    updateTenses(id, is_checked) {
        //noinspection JSCheckFunctionSignatures
        this.setState({
            tenses: this.state.tenses.map(item => {
                if (item.id == id) {
                    item.active = is_checked;
                }
                return item;
            })
        });
    }
    render() {
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
                        pronouns={Pronouns.list}
                        exceptions={Pronouns.exceptions}
                        verbs={Verbs.verbs}
                        translations={Verbs.translations}
                        tenses={this.state.tenses}
                        update={this.updateForm.bind(this)}/>
                    <Counts
                        counts={this.state.counts}/>
                    <Footer
                        tenses={this.state.tenses}
                        update={this.updateTenses.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default App;
