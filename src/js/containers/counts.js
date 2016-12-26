import React from 'react';

class Counts extends React.PureComponent {
    render() {
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
}

export default Counts;
