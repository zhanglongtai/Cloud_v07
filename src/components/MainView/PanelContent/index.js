import React from 'react';
import FileBrowser from './FileBrowser';
import MeshGenerator from './MeshGenerator';
import PostProcessor from './PostProcessor';
import Simulation from './Simulation';

class PanelContent extends React.Component {
    constructor(props) {
        super(props);
    }

	render() {
        const activeId = this.props.activeId;

		return (
            <div className="PanelContent">
                <FileBrowser visible={activeId === 0} i18n={this.props.i18n} />
                <MeshGenerator visible={activeId === 1} />
                <Simulation visible={activeId === 2} />
                <PostProcessor visible={activeId === 3} />
            </div>
		);
	}
}

PanelContent.propTypes = {
	activeId: React.PropTypes.number,
    i18n: React.PropTypes.object.isRequired,
}

export default PanelContent;
