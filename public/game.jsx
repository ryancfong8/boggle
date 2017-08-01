import React from 'react';
import Letter from './letter';

class Game extends React.Component {
  constructor(){
    super();

    this.state = {
      diceLayout: [],
      board: [],
      currentWord: "",
      currentPosition: [],
      previousPosition: [],
      validLetters: {},
      playedWords: {},
      playedLetters: [],
      playedLettersHash: {},
      clearBoard: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCurrentWord = this.updateCurrentWord.bind(this);
    this.removeLetter = this.removeLetter.bind(this);
  }

  componentWillMount() {
    const DICE = ["aaafrs",
            "aaeeee",
            "aafirs",
            "adennn",
            "aeeeem",
            "aeegmu",
            "aegmnn",
            "afirsy",
            "bjkqxz",
            "ccenst",
            "ceiilt",
            "ceilpt",
            "ceipst",
            "ddhnot",
            "dhhlor",
            "dhlnor",
            "dhlnor",
            "eiiitt",
            "emottt",
            "ensssu",
            "fiprsy",
            "gorrvw",
            "iprrry",
            "nootuw",
            "ooottu"
          ];
    function shuffle(a) {
            for (let i = a.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [a[i - 1], a[j]] = [a[j], a[i - 1]];
            }
          }
    shuffle(DICE);
    let diceLayout = DICE.map(dice => (
      dice[Math.floor(Math.random() * 5)]
    ));
    let boardGame = [[],[],[],[],[]];
    diceLayout.forEach((dice, index) => {
      if (index < 5) {
        return boardGame[0].push(dice);
      }
      else if (index < 10) {
        return boardGame[1].push(dice);
      }
      else if (index < 15) {
        return boardGame[2].push(dice);
      }
      else if (index < 20) {
        return boardGame[3].push(dice);
      }
      else {
        return boardGame[4].push(dice);
      }
    });

    this.setState({
      diceLayout: diceLayout,
      board: boardGame
    });
  }

  componentDidMount(){
    this.updateValidLetters();
  }

  updateCurrentWord(letter, coordinate) {
    if (coordinate[0] === this.state.currentPosition[0] && coordinate[1] === this.state.currentPosition[1]) {
      return this.removeLetter();
    }
    else if (this.state.clearBoard || (this.state.validLetters[coordinate] && !this.state.playedLettersHash[coordinate])) {
        let played = this.state.playedLetters;
        let previous = this.state.currentPosition;
        let playedHash = this.state.playedLettersHash;
        played.push(coordinate);
        playedHash[coordinate] = true;
        let newLetter = letter === "q" ? "qu" : letter;
        let newWord = this.state.currentWord + newLetter;
        this.setState({
        currentWord: newWord,
        currentPosition: coordinate,
        previousPosition: previous,
        playedLetters: played,
        playedLettersHash: playedHash,
        clearBoard: false
      }, () => this.updateValidLetters(coordinate));
    }
  }

  removeLetter() {
    let played = this.state.playedLetters;
    let oldLetter = played.pop();
    let newWord = this.state.currentWord.slice(this.state.currentWord.length - 2, this.state.currentWord.length) === "qu" ?
        this.state.currentWord.slice(0, this.state.currentWord.length - 2) : this.state.currentWord.slice(0, this.state.currentWord.length - 1);
    let clear = newWord.length === 0 ? true : false;
    let previous = played[played.length - 1] ? played[played.length - 1] : [];
    let playedHash = this.state.playedLettersHash;
    delete playedHash[oldLetter];
    this.setState({
      currentWord: newWord,
      playedLetters: played,
      playedLettersHash: playedHash,
      currentPosition: previous,
      clearBoard: clear
    }, () => this.updateValidLetters(previous));
  }

  updateValidLetters(coordinate) {
    if (this.state.currentPosition.length === 0 || coordinate.length === 0){
      // let set = {};
      // this.state.diceLayout.map(die => (
      //   set[die] = true
      // ));
      return this.setState({
        clearBoard: true
      });
    }
    else {
      let valid = {};
      for(let i = -1; i < 2; i++) {
        valid[[coordinate[0], coordinate[1] + i]] = true;
        valid[[(coordinate[0] - 1), coordinate[1] + i]] = true;
        valid[[(coordinate[0] + 1), coordinate[1] + i]] = true;
      }
      return this.setState({
        validLetters: valid,
        clearBoard: false
      });
    }
  }

  calculateScore(num) {
    if (num < 3) {
      return 0;
    }
    else if (num < 5) {
      return 1;
    }
    else if (num === 5) {
      return 2;
    }
    else if (num === 6) {
      return 3;
    }
    else if (num === 7) {
      return 5;
    }
    else {
      return 11;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.currentWord.length > 0) {
      let played = this.state.playedWords;
      played[this.state.currentWord] = this.calculateScore(this.state.currentWord.length);
      this.setState({
        playedWords: played,
        currentWord: "",
        currentPosition: [],
        playedLetters: [],
        playedLettersHash: {},
        clearBoard: true
      });
    }
  }

  renderGame() {
    if (this.state.board.length > 0) {
      return this.state.board.map((row, index) => (
        <div key = {index} className = "row">
          {row.map((die,idx) => (
              <Letter key = {idx} letter = {die} coordinate = {[index, idx]}
                updateCurrentWord = {this.updateCurrentWord} playedLettersHash = {this.state.playedLettersHash}/>
          ))}
        </div>
      ));
    }
  }

  render() {
    return (
      <div className = "game">
        <img src = "./logo.png" />
        <div className = "board">
          {this.renderGame()}
        </div>
        <div className = "word">
          <div>
            <text className = "currentWord">Current Word: </text>
            <span className = "current">{this.state.currentWord.toUpperCase()}</span>
          </div>
          <button className = "submit" onClick ={this.handleSubmit}>Submit Word</button>
        </div>
        <div className = "score-table">
          <table className = "table">
            <tr>
              <td className = "bold">Word</td>
              <td className = "bold">Score</td>
            </tr>
            {Object.keys(this.state.playedWords).map((word, i) => (
              <tr key = {i}>
                <td>{word}</td>
                <td>{this.state.playedWords[word]}</td>
              </tr>
            ))}
            <tr>
              <td className = "total">Total:</td>
              <td className = "total">{Object.values(this.state.playedWords).reduce((total, num) => (
                  total += num
                ), 0)}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default Game;
