import React from 'react';
import TreeView from './react-bootstrap-treeview';

class FileTreePanel extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            dir: this.props.dir,
            dirData: this.state.dirData,
        }
    }
    
    componentDidMount() {
        this.props.socket.emit('feedback', '[+] FileTree connected.');
        this.props.socket.emit('getDirData');
        this.props.socket.on('sendDirData', (dirData) => {
            updateDirData(dirData);
        });
    }

    render() {
        return (
            <div className="panel panel-default model-tree">
                <div className="panel-heading">Models Lists</div>
                <div className="list-group" ref="folder" id="folder">
                    <TreeView data={this.state.dirData} socket={this.props.socket}/>
                </div>
            </div>
        );
    }
};

FileTreePanel.PropTypes = {
    dir: React.PropTypes.string,
    dirData: React.PropTypes.object.isRequired,
};

export default FileTreePanel;
