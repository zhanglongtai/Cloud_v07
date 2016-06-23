import React from 'react';
import { Link } from 'react-router';

class Login extends React.Component {
	constructor(props) {
        super(props);
    }

    render() {
    	return (
    		<div>
	            <button type="button" className="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
			        Login
			    </button>

			    <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				    <div className="modal-dialog" role="document">
				        <div className="modal-content">
				            <div className="modal-header">
				                <h4 className="modal-title" id="myModalLabel">Choose Language</h4>
				            </div>
					        <div className="modal-body">
					            <div className="radio">
								    <label>
								        <input type="radio" name="optionsRadios" id="optionsRadios1" value="en" checked>
								            English
								        </input>
								    </label>
								</div>
								<div className="radio">
								    <label>
								        <input type="radio" name="optionsRadios" id="optionsRadios2" value="cn">
								            Chinese
								        </input>
								    </label>
								</div>
					        </div>
					        <div className="modal-footer">
						        <div className="checkbox">
								    <label>
								        <input type="checkbox"> Set as default </input>
								    </label>
								</div>
						        <button type="button" className="btn btn-default" data-dismiss="modal">
						            <Link to='/MainView'>Continue</Link>
						        </button>
					        </div>
				        </div>
				    </div>
				</div>
			</div>
    	)
    }
};

export default Login;
