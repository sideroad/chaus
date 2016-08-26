/* eslint no-new: 0 */
import {default as React, Component, PropTypes} from 'react';
const vis = require('vis');
const uuid = require('uuid');

class Graph extends Component {
  static propTypes = {
    identifier: PropTypes.string,
    dot: PropTypes.string.isRequired,
    style: PropTypes.object,
    onSelectNode: PropTypes.func,
  }
  constructor(props) {
    super(props);
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      identifier: identifier ? identifier : uuid.v4()
    };
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
          color: '#aacf53',
          highlight: '#aacf53',
          hover: '#aacf53',
          inherit: 'from',
          opacity: 1.0
        }
      },
      nodes: {
        borderWidth: 3,
        borderWidthSelected: 3,
        color: {
          border: '#aacf53',
          background: '#fffffc',
          highlight: {
            border: '#aacf53',
            background: '#fffffc'
          },
          hover: {
            border: '#fffffc',
            background: '#aacf53'
          }
        },
        shape: 'box',
        font: {
          color: '#aacf53',
          size: 20
        },
        size: 50
      },
      physics: {
        barnesHut: {
          springLength: 100,
          springConstant: 0.03,
          damping: 0.05
        },
        solver: 'barnesHut',
        minVelocity: 0
      },
      interaction: {
        dragView: false,
        zoomView: false
      }
    };
    const parsed = vis.network.convertDot(this.props.dot);
    const network = new vis.Network(container, {
      nodes: parsed.nodes,
      edges: parsed.edges
    }, options);
    network.on('selectNode', evt => {
      this.props.onSelectNode(evt.nodes[0]);
    });
  }

  render() {
    const {identifier} = this.state;
    const {style} = this.props;
    return <div style={style} id={identifier} />;
  }
}

Graph.defaultProps = {
  dot: '',
  onSelectNode: () => {},
  style: {
    width: '100%',
    height: '400px'
  }
};

export default Graph;
