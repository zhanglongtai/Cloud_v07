import React from 'react';

class MeshGenerator extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let visibleStyle = {};
        if (!this.props.visible) {
            visibleStyle = {display: "none"};
        }

		return <div style={visibleStyle}>Mesh Generator</div>
	}
}

MeshGenerator.propTypes = {
	visible: React.PropTypes.bool.isRequired,
}

MeshGenerator.defaultProps = {
	visible: true,
}

export default MeshGenerator;
