/* eslint no-new: 0 */
import { default as React, Component, PropTypes } from 'react';
import vis from 'vis';
import uuid from 'uuid';
import autoBind from 'react-autobind';

class Graph extends Component {

  constructor(props) {
    super(props);
    const { identifier } = this.props;
    this.state = {
      identifier: identifier || uuid.v4()
    };
    autoBind(this);
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    const container = document.getElementById(this.state.identifier);
    const options = {
      edges: {
        width: 3,
        color: {
          color: '#E1F6B0',
          highlight: '#E1F6B0',
          hover: '#E1F6B0',
          inherit: 'from',
          opacity: 1.0
        },
        font: {
          color: '#F3CCCC',
          size: 15,
          strokeWidth: 0
        }
      },
      nodes: {
        borderWidth: 3,
        borderWidthSelected: 3,
        color: {
          border: '#E1F6B0',
          background: '#595455',
          highlight: {
            border: '#E1F6B0',
            background: '#595455'
          },
          hover: {
            border: '#595455',
            background: '#E1F6B0'
          }
        },
        shape: 'box',
        font: {
          color: '#E1F6B0',
          size: 20
        },
        size: 50
      },
      physics: {
        barnesHut: {
          // springLength: 120,
          // springConstant: 0.03,
          // damping: 0.05
        },
        solver: 'barnesHut',
        minVelocity: 0.01
      },
      interaction: {
        dragView: false,
        zoomView: false
      },
      layout: {
        hierarchical: {
          enabled: true,
          sortMethod: 'directed'
        }
      }
    };
    const parsed = vis.network.convertDot(this.props.dot);
    const network = new vis.Network(container, {
      nodes: parsed.nodes,
      edges: parsed.edges.map(edge => ({
        ...edge,
        align: 'bottom'
      }))
    }, options);
    network.on('selectNode', evt =>
      this.props.onSelectNode(evt.nodes[0])
    );
  }

  render() {
    const { identifier } = this.state;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        id={identifier}
      />
    );
  }
}

Graph.propTypes = {
  identifier: PropTypes.string,
  dot: PropTypes.string.isRequired,
  onSelectNode: PropTypes.func,
};

Graph.defaultProps = {
  dot: '',
  onSelectNode: () => {},
};

export default Graph;
