import React from 'react';
import ParaViewWeb from './ParaViewWeb';

class PostProcessor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	paraviewweb: 'http://localhost:8080'
        }
    }

	render() {
		let visibleStyle = {};
        if (!this.props.visible) {
            visibleStyle = {display: "none"};
        }

		return (
            <div style={visibleStyle}>
                <ParaViewWeb paraviewweb={this.state.paraviewweb} />
            </div>
		);
	}
}

PostProcessor.propTypes = {
	visible: React.PropTypes.bool.isRequired,
}

PostProcessor.defaultProps = {
	visible: true,
}

export default PostProcessor;
