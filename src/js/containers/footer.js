import React from 'react';

class Footer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tenses: false,
            lists: false,
            links: false
        };
    }
    onCheck(e) {
        this.props.update(e.target.value, e.target.checked);
    }
    onToggle(v, e) {
        e.preventDefault();
        this.setState({[v]: !this.state[v]});
    }
    //noinspection JSMethodCanBeStatic
    onChangeVerbs(params, e) {
        e.preventDefault();
        window.location.hash = `#${params}`;
        location.reload();
    }
    render() {
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
                            onChange={this.onCheck.bind(this)}/>
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
                    onClick={this.onToggle.bind(this, 'tenses')}>
                    Select tenses
                </a>
                <a
                    className={'button ' + (this.state.lists ? 'primary' : 'secondary')}
                    onClick={this.onToggle.bind(this, 'lists')}>
                    Select verbs
                </a>
                <a
                    href="https://github.com/Sinkler/italian-verbs-trainer"
                    className="button secondary">
                    <i className="fi-social-github"></i>
                </a>
                <a
                    className={'button ' + (this.state.links ? 'primary' : 'secondary')}
                    onClick={this.onToggle.bind(this, 'links')}>
                    <i className="fi-link"></i>
                </a>
                {this.state.tenses &&
                    <fieldset className="fieldset text-left">
                        <legend>Select tenses</legend>
                        {tenses}
                    </fieldset>
                }
                {this.state.lists &&
                    <fieldset className="fieldset text-left">
                        <legend>Select verbs</legend>
                        <p>
                            <a
                                onClick={this.onChangeVerbs.bind(this, 'duolingo')}>
                                Duolingo list
                                {(!hash || hash == '#duolingo') &&
                                    <span className="label">current</span>
                                }
                            </a>
                        </p>
                        <p>
                            <a
                                onClick={this.onChangeVerbs.bind(this, 'swadesh')}>
                                Swadesh list + essere + avere
                                {hash == '#swadesh' &&
                                    <span className="label">current</span>
                                }
                            </a>
                        </p>
                        <p>
                            <a
                                onClick={this.onChangeVerbs.bind(this, 'short')}>
                                Short common list
                                {hash == '#short' &&
                                    <span className="label">current</span>
                                }
                            </a>
                        </p>
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
}

export default Footer;
