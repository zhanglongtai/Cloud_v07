import React from 'react';

class TreeNode extends React.Component {
	constructor(props) {
		super(props);
        let node = this.props.node;
        this.state = {
        	expanded: (node.state && node.state.hasOwnProperty('expanded')) ?
        	    node.state.expanded :
        	        (this.props.level < this.props.options.levels) ?
        	            true : false,
        }
	}

	toggleExpanded(id, event) {
		this.setState({expanded: !this.state.expanded});
		event.stopPropagation();
	}

	toggleSeleted(id, event) {
        let node = this.props.node;
        let parentDir = this.props.parentDir + '/' + node.text;
    	if (!node.nodes) {
    		this.props.socket.emit('updateModel', parentDir);
    	}
		event.stopPropagation();
	}

	render() {
		let node = this.props.node;
		let options = this.props.options;
        let parentDir = this.props.parentDir + '/' + node.text;

		let style;
		if (!this.props.visible) {
			style = {
				display: 'none',
			};
		} else {
			if (options.highlightSelected && this.state.selected) {
				style = {
					color: options.selectedColor,
					backgroundColor: options.selectedBackColor,
				};
			} else { style = {
					color: node.color || options.color,
					backgroundColor: node.color || options.backColor,
				}
			}

			if (!options.showBorder) {
				style.border = 'none';
			} else if (options.borderColor) {
				style.border = '1px solid ' + options.borderColor;
			}
		}

		let indents = [];
		for (let i = 0; i < this.props.level - 1; i++) {
			indents.push(<span className="indent"></span>);
		}

		let expandCollapseIcon;
		if (node.nodes) {
			if (!this.state.expanded) {
				expandCollapseIcon = (
                    <span className={options.expandIcon}
                          onClick={this.toggleExpanded.bind(this, node.nodeId)}>
                    </span>
				);
			} else {
				expandCollapseIcon = (
					<span className={options.collapseIcon}
                        onClick={this.toggleExpanded.bind(this, node.nodeId)}>
                    </span>
				);
			}
		} else {
			expandCollapseIcon = (
                <span className={options.emptyIcon}></span>
			);
		}

		let nodeIcon = (
	        <span className='icon'>
		        <i className={node.icon || options.nodeIcon}></i>
	        </span>
	    );
		
		let nodeText;
        if (options.enableLinks) {
            nodeText = (
	            <a href={node.href} /*style="color:inherit;"*/>
	                {node.text}
	            </a>
            );
        } else {
            nodeText = (
                <span>{node.text}</span>
            );
        }

        let badges;
        if (options.showTags && node.tags) {
            badges = node.tags.map( tag => {
	            return (
	                <span className='badge'>{tag}</span>
	            );
            });
        }

        let children = [];
        if (node.nodes) {
        	node.nodes.forEach( childNode => {
        		children.push(<TreeNode node={childNode}
                                        level={this.props.level+1}
                                        visible={this.state.expanded && this.props.visible}
                                        options={options}
                                        parentDir={parentDir}
                                        socket={this.props.socket} />);
        	});
        }

        return (
            <li className="list-group-item"
                style={style}
                onClick={this.toggleSeleted.bind(this, node.nodeId)}
                key={node.nodeId}>
                {indents}
                {expandCollapseIcon}
                {nodeIcon}
                {nodeText}
                {badges}
                {children}
            </li>
        );
	}
}

class TreeView extends React.Component {
	constructor(props) {
		super(props);
	}

	setNodeId(dataArr) {
        if (!dataArr.nodes) return;

        dataArr.nodes.forEach( childNode => {
        	childNode.nodeId = this.props.nodes.length;
        	this.props.nodes.push(childNode);
        	this.setNodeId(childNode);
        });
	}

	render() {
		let data = this.props.data;

		this.setNodeId({nodes: data});

		let children = [];
		if (data) {
			data.forEach( node => {
                children.push(<TreeNode node={node}
                	                    level={1}
                	                    visible={true}
                	                    options={this.props}
                	                    parentDir={''}
                                        socket={this.props.socket}
                	         />);
			});
		}

		return (
            <div id="treeview" className='treeview'>
                <ul className="list-group">
                    {children}
                </ul>
            </div>
		);
	}
}

TreeView.propTypes = {
	levels: React.PropTypes.number,

	expandIcon: React.PropTypes.string,
    collapseIcon: React.PropTypes.string,
    emptyIcon: React.PropTypes.string,
    nodeIcon: React.PropTypes.string,

    color: React.PropTypes.string,
    backColor: React.PropTypes.string,
    borderColor: React.PropTypes.string,
    onhoverColor: React.PropTypes.string,
    selectedColor: React.PropTypes.string,
    selectedBackColor: React.PropTypes.string,

    enableLinks: React.PropTypes.bool,
    highlightSelected: React.PropTypes.bool,
    showBorder: React.PropTypes.bool,
    showTags: React.PropTypes.bool,

    nodes: React.PropTypes.arrayOf(React.PropTypes.number)
}

TreeView.defaultProps = {
	levels: 2,

	expandIcon: 'glyphicon glyphicon-folder-close',
    collapseIcon: 'glyphicon glyphicon-folder-open',
    emptyIcon: 'glyphicon glyphicon-list-alt',
    nodeIcon: 'glyphicon',

    color: undefined,
    backColor: undefined,
    borderColor: undefined,
    onhoverColor: '#F5F5F5', // TODO Not implemented yet, investigate radium.js 'A toolchain for React component styling'
    selectedColor: '#FFFFFF',
    selectedBackColor: '#428bca',

    enableLinks: false,
    highlightSelected: true,
    showBorder: true,
    showTags: false,

    nodes: []
}

export default TreeView;
