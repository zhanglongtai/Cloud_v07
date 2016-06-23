import React from 'react';
import TreeView from './react-bootstrap-treeview';
import { updateDirDataAction } from '../../../../actions';

class FileTreePanel extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            dir: this.props.
        }

    getInitialState: function() {
        return {
            dir: this.props.dirStore.getState(),
            dirData: this.props.dirDataStore.getState(),
        };
    },
    
    componentDidMount() {
        let listenDirData = this.props.dirDataStore.subscribe(this.updateDirData);
        this.props.socket.emit('feedback', '[+] FileTree connected.');
        this.props.socket.emit('getDirData');
        this.props.socket.on('sendDirData', (dirData) => {
            this.props.dirDataStore.dispatch(updateDirDataAction(dirData));
        });
    },

    updateDirData: function() {
        this.setState({dirData: this.props.dirDataStore.getState()})
    },

    render: function() {
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

FileTreePanel.propTypes = {
    dir: React.PropTypes.string,
    dirData: React.PropTypes.object.isRequired,
};

export default FileTreePanel;
