import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/**
 * Square function
 * 
 * Helps create each square component
 * Props value is passed down from parent (board) and state of square is controlled by parent
 * 
 * Returns square component to be rendered
 */
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Board component
 * 
 * Renders the square components
 * State of square components are controlled in parent (Game) function
 * 
 * Controls the structure of the board
 */
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/**
 * Game component
 * 
 * Highest level component
 * Controls the logic of the game
 * Maintains the state of the squares
 * 
 * Turns and winner are handled here
 */
class Game extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state variables here
    this.state = {
      // array holding square objects containing history moves
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0, // What step the current move is on
      xIsNext: true, // Decides turns, checks if its X's turn
    };
  }

  // Handles click on a square
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // Slices to throw away any future moves if step number older than current
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // When space is filled or winner is declared, do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Otherwise fill the square with either x or o
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares, // add the new board/square values to the history state
      }]),
      stepNumber: history.length, // update the step number
      xIsNext: !this.state.xIsNext, // change turns
    });
  }

  // Function to jump to chosen step
  // Activated when user clicks on a previous step
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleReset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // current board is rendered by given by the step number it is on
    const winner = calculateWinner(current.squares); // Checks for winner on render
    const draw = calculateDraw(current.squares);

    // Log History of Moves
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      // Renders history moves
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let gameOver
    if (winner) {
      status = "Winner: " + winner + "!";
      gameOver = true;
    } 
    else if (draw) {
      status = "Draw Game!"
      gameOver = true;
    }
    else {
      status = this.state.xIsNext ? "X's Turn" : "O's Turn";
      gameOver = false;
    }

    const playAgain = <button onClick={() => this.handleReset()}>Play Again</button>;

    // Renders the board
    return (
      <div className="game">
        <div className="title">
          <h1>Simple TicTacToe</h1>
        </div>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
          <div className="status">{status}</div>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
        <div className="play-again">{gameOver ? playAgain : <p></p>}</div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    // All possible win cases
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function calculateDraw(squares) {
  let isDraw = false;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== null) {
      isDraw = true;
    }
  }

  return isDraw;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
