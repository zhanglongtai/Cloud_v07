import React from 'react';
import MainView from './MainView';
import Login from './Login';

class App extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	workbench: false,
        	lang: 'en',
        }
    }

    render() {
    	if (this.state.workbench) {
    		return (
    			<MainView lang={this.state.lang} />
    		);
    	} else {
    		return (
                <Login />
    		)
    	}
    }
}