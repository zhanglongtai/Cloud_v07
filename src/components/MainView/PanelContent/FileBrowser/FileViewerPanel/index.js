import React from 'react';
import Viewer from './Viewer';
import $ from 'jquery';
import { updateModelAction } from '../../../../actions';

export default React.createClass({
    
    propTypes: {
        url: React.PropTypes.string,
    },

    getInitialState: function() {
    	return {
    		modelName: this.props.modelStore.getState(),
    	}
    },

    // fetchModelInfo: function() {
    //     $.ajax({
    //     	url: this.props.url,
    //     	dataType: 'json',
    //     	cache: 'false',
    //     	success: function(data) {
    //             this.props.modelStore.dispatch(updateModelAction(data[data.length-1].name));
    //     	    console.log("read exec");
    //     	}.bind(this)
    //     });
    // },

	componentDidMount: function() {
	    let listenUpdateModel = this.props.modelStore.subscribe(this.updateModel);	

		this.props.socket.emit('feedback', '[+] FileViewerPanel connected');
		this.props.socket.emit('loadModel');

        // this.props.socket.on('showModel', () => {
        // 	this.props.socket.emit('feedback', '[+] showModel msg recived');
        //     this.fetchModelInfo();
        // });

		this.props.socket.on('sendModel', (model) => {
            this.props.modelStore.dispatch(updateModelAction(model));
            this.props.socket.emit('feedback', '[+] Recive sendModel: ' + model);
		});
    },

    updateModel: function() {
        this.setState({
        	modelName: this.props.modelStore.getState(),
        });
    },

    render: function() {
    	return (
            <div className="FileViewerPanel">
                <Viewer modelName={this.state.modelName} i18n={this.props.i18n}/>
            </div>
    	);
    }
});
