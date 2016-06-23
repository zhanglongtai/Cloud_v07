import React from 'react';

class ParaViewWeb extends React.Component {
	constructor(props) {
        super(props);
    }

    render() {
    	return (
            <iframe src={this.props.paraviewweb} style={{width: 1000, height: 1000}}/>
    	);
    }
}

ParaViewWeb.propTypes = {
	paraviewweb: React.PropTypes.string.isRequired,
}

export default ParaViewWeb;
