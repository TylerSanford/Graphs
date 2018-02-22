import React, { Component } from 'react';
import { Graph, dump } from './graph';
import './App.css';

// !!! IMPLEMENT ME
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

/**
 * GraphView
 */
class GraphView extends Component {
  constructor() {
    super();
    this.state = {
      graph: [],
      ctx: null
    };
  }
  
  componentWillReceiveProps(newProps) {
    clearTimeout(this.timeout);
    this.setState({ graph: newProps.graph.getConnectedComponents() });
  }

  componentDidMount() {
    this.setState({ graph: this.props.graph.getConnectedComponents() });
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  handleBFS = () => {
    const bfsPos = this.props.graph.bfs(this.state.graph[0]);
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext('2d');
    const drawBFS = (pos, interval) => {
      setTimeout(() => {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 22, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'green';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#000';
          ctx.stroke();
      }, interval);
    }
    for (let i = 0; i < bfsPos.length; i++) {
      drawBFS(bfsPos[i], i * 1000);
    }
  }

  updateCanvas() {
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext('2d');
    
    // Clear it
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // random color
    const randomColor = () => {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

   // !!! IMPLEMENT ME
   // draw edges
    this.state.graph.forEach(vertex => {
      vertex.edges.forEach(edge => {
        const vPair = edge.destination;
        ctx.beginPath();
          
        ctx.lineWidth = 5;
        ctx.strokeStyle = randomColor();
        ctx.moveTo(vertex.pos.x, vertex.pos.y);
        ctx.lineTo(vPair.pos.x, vPair.pos.y);
        ctx.stroke();
        ctx.fillText(vertex.value, vertex.pos.x - 7, vertex.pos.y + 4);
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
      })
    })
  }
  
  /**
   * Render
   */
  render() {
    return (
      <div>
        <canvas ref="canvas" width={canvasWidth} height={canvasHeight}></canvas>
        <button onClick={this.props.newGraph}>New Graph</button>
        <button onClick={this.handleBFS}>Run BFS</button>
      </div>
    )
  }
}


/**
 * App
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: new Graph()
    };

    // !!! IMPLEMENT ME
    // use the graph randomize() method
    this.state.graph.randomize(5, 4, 150, 0.6);
    this.state.graph.dump();
  }

  newGraph = () => {
    const state = {
      graph: new Graph()
    };
    state.graph.randomize(5, 4, 150, 0.6);
    state.graph.dump();
    this.setState(state);
  }

  render() {
    return (
      <div className="App">
        <GraphView graph={this.state.graph} newGraph={this.newGraph}></GraphView>
      </div>
    );
  }
}

export default App;
