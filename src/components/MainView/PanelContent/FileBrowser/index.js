import React           from 'react';
import io              from 'socket.io-client';
import FileUploadPanel from './FileUploadPanel';
import FileTreePanel   from './FileTreePanel';
import FileMenuPanel   from './FileMenuPanel';
import FileViewerPanel from './FileViewerPanel';
import { updateModelStore as modelStore } from '../../../stores';
import { updateDirStore as dirStore } from '../../../stores';
import { updateDirDataStore as dirDataStore } from '../../../stores';

class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keepalive: true,
        }
    }

	render() {
        let visibleStyle = {};
        if (!this.props.visible) {
            visibleStyle = {display: "none"};
        }

		return (
            <div className="FileBrowser row" style={visibleStyle}>
                <div className="col-md-3">
                    <FileUploadPanel socket={this.props.socket} dirStore={dirStore} modelStore={modelStore} i18n={this.props.i18n}/>
                    <FileTreePanel socket={this.props.socket} dirStore={dirStore} dirDataStore={dirDataStore}/>
                </div>
                <div className="col-md-3">
                    <FileMenuPanel />
                </div>
                <div className="col-md-6">
                    <FileViewerPanel url="/api/model" socket={this.props.socket} modelStore={modelStore} i18n={this.props.i18n}/>
                </div>
            </div>
		)
	}
}

FileBrowser.propTypes = {
    visible: React.PropTypes.bool.isRequired,
    i18n: React.PropTypes.object.isRequired,
}

FileBrowser.defaultProps = {
    visible: true,
    socket: io.connect('http://localhost:8000'),
}

export default FileBrowser;
