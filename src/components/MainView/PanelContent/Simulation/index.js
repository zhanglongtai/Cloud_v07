import React from 'react';

class Simulation extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let visibleStyle = {};
        if (!this.props.visible) {
            visibleStyle = {display: "none"};
        }
		
		return <div style={visibleStyle}>Simulation</div>
	}
}

Simulation.propTypes = {
	visible: React.PropTypes.bool.isRequired,
}

Simulation.defaultProps = {
	visible: true,
}

export default Simulation;
