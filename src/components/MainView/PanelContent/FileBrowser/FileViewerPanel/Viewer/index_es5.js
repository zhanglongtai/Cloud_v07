import React from 'react';
var THREE = require("three");
var STLLoader = require('three-stl-loader')(THREE);
import TrackballControls from 'three-trackballcontrols';
import $ from 'jquery';

export default React.createClass({
	propTypes: {
        modelName: React.PropTypes.bool.isRequired,
    },

    getInitialState: function() {
        return {
            showMesh: false,
        };
    },

    threeSTLModel: function() {
    	camera, controls, scene, renderer, container;
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        objectsInScene = [];
        var _this = this;

        var axisHelper = new THREE.AxisHelper( 5 );

        var exactModelName = this.props.modelName;
        while (exactModelName.indexOf('/') != -1) {
            exactModelName = exactModelName.slice(exactModelName.indexOf('/') + 1);
        }

        init();
		animate();

		function init() {
			// scene
			scene = new THREE.Scene();
            
            // axis
            scene.add( axisHelper );

			// renderer
			renderer = new THREE.WebGLRenderer();
            renderer.setClearColor( 0XEEEEEE );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(  window.innerWidth, window.innerHeight );

			container = document.getElementById("viewer");
            container.appendChild(renderer.domElement);
            
            // camera
            camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 5000 );
            camera.position.x = 500;
            camera.position.y = 500;
            camera.position.z = 500;
			
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
            var loader = new STLLoader();

            loader.load('/models' + _this.props.modelName, function (geometry) {
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
			var light = new THREE.AmbientLight( 0x222222 );
			scene.add( light );
            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-30, 60, 60);
            spotLight.castShadow = true;
            scene.add(spotLight);

            var tmp_state = _this.state;
            tmp_state[exactModelName] = false;
            _this.setState(tmp_state);

            renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		}

        function onDocumentMouseDown( event ) {
            event.defaultPrevented;

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects( objectsInScene );
            if ( intersects.length > 0 ) {
                if (_this.state[intersects[0].object.geometry.name] == "default") {
                    intersects[ 0 ].object.material.setValues( {color: 0XFF0000} );
                    tmp_state = _this.state;
                    tmp_state[intersects[0].object.geometry.name] = "changed";
                    _this.setState(tmp_state);
                }
                else {
                    intersects[ 0 ].object.material.setValues( {color: 0x7777ff} );
                    tmp_state = _this.state;
                    tmp_state[intersects[0].object.geometry.name] = "default";
                    _this.setState(tmp_state);
                }
            }
            else {
                if (_this.state[objectsInScene[0].geometry.name] === "changed") {
                    objectsInScene[0].material.setValues( {color: 0x7777ff} );
                    tmp_state = _this.state;
                    _this.state[objectsInScene[0].geometry.name] = "default";
                    _this.setState(tmp_state);
                }
            }
        }

		function animate() {
			requestAnimationFrame( animate );
			controls.update();
			render();
		}

		function render() {
			renderer.render( scene, camera );
		}
    },

    componentDidMount: function() {
	    this.threeSTLModel();
    },

    changeMesh: function() {
        var _this = this;
        if ( _this.state.mesh) {
            objectsInScene[0].material.setValues( {wireframe: false} );
            _this.setState({mesh: false});
        }
        else {
            objectsInScene[0].material.setValues( {wireframe: true} );
            _this.setState({mesh: true});
        }
    },

    resetX: function() {
        var center = objectsInScene[0].geometry.center();
        var boundbox = objectsInScene[0].geometry.boundingBox;
        var vector3 = boundbox.size(null);
        var scale = vector3.length();
        camera.position.set(center.x + scale, center.y, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(0, 1, 0);
        scene.add(camera);
    },

    resetY: function() {
        var center = objectsInScene[0].geometry.center();
        var boundbox = objectsInScene[0].geometry.boundingBox;
        var vector3 = boundbox.size(null);
        var scale = vector3.length();
        camera.position.set(center.x, center.y + scale, center.z);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    },

    resetZ: function() {
        var center = objectsInScene[0].geometry.center();
        var boundbox = objectsInScene[0].geometry.boundingBox;
        var vector3 = boundbox.size(null);
        var scale = vector3.length();
        camera.position.set(center.x, center.y, center.z + scale);
        camera.lookAt(center);
        camera.up = new THREE.Vector3(1, 0, 0);
        scene.add(camera);
    },

    render: function() {
    	return (
            <div className="panel panel-default Viewer">
                <div className="panel-heading">Model Viewport</div>
                <div className="panel-body model-viewer" id="model-viewer">
                    <div className="coordinate" id="coordinate">
                        <div></div>
                    </div>
                    <div></div>
                </div>
                <button onClick={this.changeMesh}>Mesh</button>
                <button onClick={this.resetX}> + X </button>
                <button onClick={this.resetY}> + Y </button>
                <button onClick={this.resetZ}> + Z </button>
            </div>
    	);
    }
});
