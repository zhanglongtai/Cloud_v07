import React from 'react';
import $ from 'jquery';
//import * as THREE from "three";
var THREE = require("three");
//import * as threeStlLoader from 'three-stl-loader';
var STLLoader = require('three-stl-loader')(THREE);
import TrackballControls from 'three-trackballcontrols';
import { updateModelAction } from '../../../actions';

// let camera, controls, scene, renderer, container;
// let camera2, scene2, renderer2, container2;
// let raycaster = new THREE.Raycaster();
// let mouse = new THREE.Vector2();

// let objectsInScene = [];

export default React.createClass({
    
    propTypes: {
        url: React.PropTypes.string,
    },

    getInitialState: function() {
    	return {
    		modelName: this.props.modelStore.getState(),
            showMesh: false,
    	}
    },

    fetchModelInfo: function() {
        $.ajax({
        	url: this.props.url,
        	dataType: 'json',
        	cache: 'false',
        	success: function(data) {
                this.props.modelStore.dispatch(updateModelAction(data[data.length-1].name));
        	    console.log("read exec");
        	}.bind(this)
        });
    },

    threeSTLModel: function() {
    	
        let modelname = this.state.modelName;
        let camera, controls, scene, renderer, container;
        let camera2, scene2, renderer2, container2;

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        let _this = this;

        init();
		animate();

		function init() {
			// scene
			scene = new THREE.Scene();

			// renderer
			renderer = new THREE.WebGLRenderer();
            renderer.setClearColor( 0XEEEEEE );
			renderer.setPixelRatio( window.devicePixelRatio );
            let canvasSize = {
                                 width: $("#model-viewer").width(),
                                 //height: $("#model-viewer").height(),
                             };
            renderer.setSize( canvasSize.width*0.95, canvasSize.width*0.95 );
            // deleted previous model view
			container = document.getElementById("model-viewer");
            container.removeChild(container.lastChild);
            container.appendChild(renderer.domElement);
            
            // camera
            camera = new THREE.PerspectiveCamera( 90, 1, 0.1, 5000 );
			
            // controls
            controls = new TrackballControls( camera, renderer.domElement );
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.noZoom = false;
            controls.noPan = false;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            
            // delete '/' in modelName to acquire model's exact name
            // then add the model's name to 'this.state' to verdict selected status of the model
            let tmp_state = _this.state;
            let exactModelName = modelname;
            while (exactModelName.indexOf('/') != -1) {
                exactModelName = exactModelName.slice(exactModelName.indexOf('/') + 1);
            }
            tmp_state[exactModelName] = false;
            _this.setState(tmp_state);

            // model
            let loader = new STLLoader();

            loader.load('/models' + modelname, function (geometry) {
                geometry.name = exactModelName;
                let material = new THREE.MeshPhongMaterial({color: 0x7777ff});
                let mesh = new THREE.Mesh(geometry, material);

                let center = geometry.center();
			    let boundbox=geometry.boundingBox;
			    let vector3 = boundbox.size(null);
			    let scale = vector3.length();
			    camera.position.set(scale, scale, scale);
			    camera.lookAt(scene.position);
			    scene.add(camera);

			    mesh.position.set(0,0,0);
                scene.add(mesh);
                objectsInScene.push(mesh);
            });

            // light
            let light = new THREE.AmbientLight( 0x222222 );
            scene.add( light );
            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-30, 60, 60);
            spotLight.castShadow = true;
            scene.add(spotLight);
            
            // add auxiliary coordinate
            // scene2
            scene2 = new THREE.Scene();
            // renderer2
            renderer2 = new THREE.WebGLRenderer();
            renderer2.setClearColor( 0XEEEEEE );
            renderer2.setSize( canvasSize.width*0.1, canvasSize.width*0.1 );
            container2 = document.getElementById('coordinate');
            container2.removeChild(container2.lastChild);
            container2.appendChild( renderer2.domElement );
            // camera2
            camera2 = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
            camera2.up = camera.up;
            // axe2
            let axes2 = new THREE.AxisHelper( 200 );
            scene2.add( axes2 );
            
            // listen mouse event to toggle selected object's color
            renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		}

        function onDocumentMouseDown( event ) {
            event.defaultPrevented;
            
            // capture mouse's location
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            // emit a raycast to capture intersected objects
            raycaster.setFromCamera( mouse, camera );
            let intersects = raycaster.intersectObjects( objectsInScene );
            // intersects.length > 0 --- mouse click a object
            // intersects.length <= 0 --- mouse click blank place
            if ( intersects.length > 0 ) {
                // change object's color to indicate selected status
                if (!_this.state[intersects[0].object.geometry.name]) {
                    intersects[ 0 ].object.material.setValues( {color: 0XFF0000} );
                    let tmp_state = _this.state;
                    tmp_state[intersects[0].object.geometry.name] = true;
                    _this.setState(tmp_state);
                } else {
                    intersects[ 0 ].object.material.setValues( {color: 0x7777ff} );
                    let tmp_state = _this.state;
                    tmp_state[intersects[0].object.geometry.name] = false;
                    _this.setState(tmp_state);
                }
            } else {
                // click blank place indicate to cancle selected status
                if (_this.state[objectsInScene[0].geometry.name]) {
                    objectsInScene[0].material.setValues( {color: 0x7777ff} );
                    let tmp_state = _this.state;
                    _this.state[objectsInScene[0].geometry.name] = false;
                    _this.setState(tmp_state);
                }
            }
        }

		function animate() {
			requestAnimationFrame( animate );
			controls.update();
            camera2.position.copy( camera.position );
            camera2.position.sub( controls.target ); // added by @libe
            camera2.position.setLength( 300 );
            camera2.lookAt( scene2.position );
			render();
		}

		function render() {
			renderer.render( scene, camera );
            renderer2.render( scene2, camera2 );
		}
    },

	componentDidMount: function() {
	    let listenUpdateModel = this.props.modelStore.subscribe(this.updateModel);	

		this.props.socket.emit('feedback', 'ModelViewer componentDidMount connected');
		this.props.socket.emit('loadModel');

        this.props.socket.on('showModel', function() {
        	this.props.socket.emit('feedback', 'showModel msg recived');
            //return this.fetchModelInfo();
        }.bind(this));

		this.props.socket.on('sendModel', function(model) {
            this.props.modelStore.dispatch(updateModelAction(model));
            this.props.socket.emit('feedback', 'Recive sendModel' + model);
            //return this.updateModel(model);
		}.bind(this));
    },

    updateModel: function() {
        this.setState({
        	modelName: this.props.modelStore.getState(),
        });
    },

    componentDidUpdate: function() {
        this.threeSTLModel();
    },

    changeMesh: function() {
        let _this = this;
        if ( _this.state.showMesh) {
            objectsInScene[0].material.setValues( {wireframe: false} );
            _this.setState({showMesh: false});
        }
        else {
            objectsInScene[0].material.setValues( {wireframe: true} );
            _this.setState({showMesh: true});
        }
    },

    resetX: function() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x + scale, center.y, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(0, 1, 0);
        scene.add(camera);
    },

    resetY: function() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x, center.y + scale, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    },

    resetZ: function() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x, center.y, center.z + scale);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    },

    render: function() {
    	return (
            <div className="panel panel-default FileViewerPanel" id="model-vieweport">
                <div className="panel-heading">Model Viewport</div>
                <div className="panel-body model-viewer" id="model-viewer">
                    <div className="coordinate" id="coordinate">
                        <div></div>
                    </div>
                    <div></div>
                </div>
                <button onClick={this.changeMesh}>Mesh</button>
            </div>
    	);
    }
});
