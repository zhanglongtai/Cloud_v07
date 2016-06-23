import React from 'react';
var THREE = require("three");
var STLLoader = require('three-stl-loader')(THREE);
import TrackballControls from 'three-trackballcontrols';
import $ from 'jquery';

let camera, controls, scene, renderer, container, light, spotLight;
let camera2, scene2, renderer2, container2;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let objectsInScene = [];

class Viewer extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            expanded: false,
        	modelName: "",
        };

        this.threeSTLModel = this.threeSTLModel.bind(this);
        this.changeMesh = this.changeMesh.bind(this);
        this.resetX = this.resetX.bind(this);
        this.resetY = this.resetY.bind(this);
        this.resetZ = this.resetZ.bind(this);
        this.fullscreenClick = this.fullscreenClick.bind(this);
	}

    componentDidMount() {
        this.threeSTLModel();
    }

    componentDidUpdate() {
        this.threeSTLModel();
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.modelName !== this.props.modelName) {
    //         this.setState(
    //             {
    //                 modelName: nextProps.modelName,
    //             }
    //         );
    //     }
    // }

    shouldComponentUpdate(nextProps) {
        return (nextProps.i18n !== this.props.i18n) || (nextProps.modelName !== this.props.modelName);
    }

    threeSTLModel() {
        let _this = this;
        let modelName = this.props.modelName;

        let exactModelName = this.props.modelName;
        while (exactModelName.indexOf('/') != -1) {
            exactModelName = exactModelName.slice(exactModelName.indexOf('/') + 1);
        }

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
			container = document.getElementById("outCanvas");
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
            
            // model
            let loader = new STLLoader();

            loader.load('/models' + modelName, function (geometry) {
                geometry.name = exactModelName;
                let material = new THREE.MeshPhongMaterial({color: 0x7777ff});
                let mesh = new THREE.Mesh(geometry, material);

                let center = geometry.center();
			    let boundbox = geometry.boundingBox;
			    let vector3 = boundbox.size(null);
			    let scale = vector3.length()*0.6;
			    camera.position.set(center.x + scale, center.y + scale, center.z + scale);
			    camera.lookAt(scene.position);
			    scene.add(camera);

			    mesh.position.set(0,0,0);
                scene.add(mesh);
                objectsInScene = [];
                objectsInScene.push(mesh);
            });

            // light
            light = new THREE.AmbientLight( 0x222222 );
            scene.add( light );
            spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-30, 60, 60);
            spotLight.castShadow = true;
            scene.add(spotLight);

            // then add the model's name to 'this.state' to verdict selected status of the model
            let tmp_state = _this.state;
            tmp_state[exactModelName] = false;
            _this.setState(tmp_state);
            
            // add auxiliary coordinate
            // scene2
            scene2 = new THREE.Scene();
            // renderer2
            renderer2 = new THREE.WebGLRenderer({alpha: true});
            renderer2.setClearColor( 0X000000, 0 );
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
                // if (!_this.state[intersects[0].object.geometry.name]) {
                //     intersects[ 0 ].object.material.setValues( {color: 0XFF0000} );
                //     let tmp_state = _this.state;
                //     tmp_state[intersects[0].object.geometry.name] = true;
                //     _this.setState(tmp_state);
                // } else {
                //     intersects[ 0 ].object.material.setValues( {color: 0x7777ff} );
                //     let tmp_state = _this.state;
                //     tmp_state[intersects[0].object.geometry.name] = false;
                //     _this.setState(tmp_state);
                // }

                if (!_this.state[intersects[0].object.geometry.name]) {
                    intersects[ 0 ].object.material.setValues( {color: 0XFF0000} );
                    let tmp_state = _this.state;
                    tmp_state[intersects[0].object.geometry.name] = true;
                    _this.setState(tmp_state);
                } else {
                    if (_this.state.mesh) {
                        intersects[ 0 ].object.material.setValues( {color: 0X000000} );
                        let tmp_state = _this.state;
                        tmp_state[intersects[0].object.geometry.name] = false;
                        _this.setState(tmp_state);
                    } else {
                        intersects[ 0 ].object.material.setValues( {color: 0x7777ff} );
                        let tmp_state = _this.state;
                        tmp_state[intersects[0].object.geometry.name] = false;
                        _this.setState(tmp_state);
                    }
                }

            } else {
                // click blank place indicate to cancle selected status
                // if (_this.state[objectsInScene[0].geometry.name]) {
                //     objectsInScene[0].material.setValues( {color: 0x7777ff} );
                //     let tmp_state = _this.state;
                //     _this.state[objectsInScene[0].geometry.name] = false;
                //     _this.setState(tmp_state);
                // }

                if (_this.state[objectsInScene[0].geometry.name]) {
                    if (_this.state.mesh) {
                        intersects[ 0 ].object.material.setValues( {color: 0X000000} );
                        let tmp_state = _this.state;
                        tmp_state[intersects[0].object.geometry.name] = false;
                        _this.setState(tmp_state);
                    } else {
                        objectsInScene[0].material.setValues( {color: 0x7777ff} );
                        let tmp_state = _this.state;
                        _this.state[objectsInScene[0].geometry.name] = false;
                        _this.setState(tmp_state);
                    }
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
            spotLight.position.copy( camera.position );
			render();
		}

		function render() {
			renderer.render( scene, camera );
            renderer2.render( scene2, camera2 );
		}
    }

    changeMesh() {
        let _this = this;
        if ( _this.state.mesh) {
            objectsInScene[0].material.setValues( {wireframe: false} );

            // change model color
            let objectName = objectsInScene[0].geometry.name
            if (_this.state[objectName]) {
                objectsInScene[0].material.setValues( {color: 0XFF0000} );
            } else {
                objectsInScene[0].material.setValues( {color: 0x7777ff} );
            }

            _this.setState({mesh: false});
        } else {
            objectsInScene[0].material.setValues( {wireframe: true} );
            
            // change mesh color
            let objectName = objectsInScene[0].geometry.name
            if (_this.state[objectName]) {
                objectsInScene[0].material.setValues( {color: 0XFF0000} );
            } else {
                objectsInScene[0].material.setValues( {color: 0X000000} );
            }

            _this.setState({mesh: true});
        }
    }

    resetX() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x + scale, center.y, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(0, 1, 0);
        scene.add(camera);
    }

    resetY() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x, center.y + scale, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    }

    resetZ() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length();
        camera.position.set(center.x, center.y, center.z + scale);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    }

    resetCamera() {
        let center = objectsInScene[0].geometry.center();
        let boundbox = objectsInScene[0].geometry.boundingBox;
        let vector3 = boundbox.size(null);
        let scale = vector3.length()*0.6;
        camera.position.set(center.x + scale, center.y + scale, center.z + scale);
        camera.lookAt(scene.position);
        scene.add(camera);
    }

    fullscreenClick() {
        let buttonNode = $("#button-fullscreen");
        if (this.state.expanded) {
            buttonNode.children('i').removeClass("glyphicon-resize-small");
            buttonNode.children('i').addClass("glyphicon-resize-full");
        } else {
            buttonNode.children('i').removeClass("glyphicon-resize-full");
            buttonNode.children('i').addClass("glyphicon-resize-small");
        }
        buttonNode.closest('.panel').toggleClass('panel-fullscreen');

        // resize canvas
        let canvasSize = {
            width: $("#model-viewer").width(),
            height: $("#model-viewer").height(),
        };
        renderer.setSize( canvasSize.width*0.95, canvasSize.height*0.95 );
    }

    render() {
    	return (
            <div className="panel panel-default Viewer">
                <div className="panel-heading">
                    {this.props.i18n.TitleModelViewport}
                    <ul className="list-inline panel-actions">
                        <li>
                            <a href="#" id="button-fullscreen" role="button" title="Toggle fullscreen" onClick={this.fullscreenClick}>
                                <i className="glyphicon glyphicon-resize-full"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="panel-body model-viewer" id="model-viewer">
                    <div className="outCanvas" id="outCanvas" style={{
                                                                      position: "relative",
                                                                    }}>
                        <div className="coordinate" id="coordinate" style={{
                                                                            position: "absolute",
                                                                            left: 20,
                                                                            bottom: 20,
                                                                            zIndex: 2
                                                                          }}>
                            <div></div>
                        </div>
                        <div></div>
                    </div>
                </div>
                <button onClick={this.changeMesh}> {this.props.i18n.BtnMesh} </button>
                <button onClick={this.resetCamera}> {this.props.i18n.BtnReset} </button>
                <button onClick={this.resetX}> + X </button>
                <button onClick={this.resetY}> + Y </button>
                <button onClick={this.resetZ}> + Z </button>
            </div>
    	);
    }
}

Viewer.propTypes = {
    modelName: React.PropTypes.string.isRequired,
}

export default Viewer;
