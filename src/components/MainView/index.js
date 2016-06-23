import React from 'react';
import { enPackage } from '../lang/en.js';
import { cnPackage } from '../lang/cn.js';
import PanelContent from './PanelContent';

class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	activeId: 0,
            lang: enPackage,
        };
        this.updateActive = this.updateActive.bind(this);
        this.changeActive = this.changeActive.bind(this);
    }
    
    updateActive(e) {
        this.changeActive(Number(e.target.dataset.idx) || 0);
    }

    changeActive(idx) {
    	this.setState({activeId: idx});
    }

    updateLang(langText) {
        if (langText === 'English') {
            this.setState({lang: enPackage});
        } else {
            this.setState({lang: cnPackage});
        }
        
    }

    render() {
    	return (
	    	<div className="PanelContent container-fluid">
	            <div className="row">
	                <div className="Brand col-md-2">STUPA-Cloud</div>
	                <ul className="nav nav-tabs">
	                    <li role="presentation"><a data-idx="0" onClick={this.updateActive}>File Browser</a></li>
	                    <li role="presentation"><a data-idx="1" onClick={this.updateActive}>Mesh Generator</a></li>
	                    <li role="presentation"><a data-idx="2" onClick={this.updateActive}>Simulation</a></li>
	                    <li role="presentation"><a data-idx="3" onClick={this.updateActive}>Post Processor</a></li>
	                </ul>
                    <button type="button" class="btn btn-default" onClick={this.updateLang.bind(this, 'English')}>English</button>
                    <button type="button" class="btn btn-default" onClick={this.updateLang.bind(this, 'Chinese')}>Chinese</button>
	                <PanelContent activeId={this.state.activeId} i18n={this.state.lang}/>
	            </div>
	        </div>
		);
    }
}

export default MainView;
