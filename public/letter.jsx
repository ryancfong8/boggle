import React from 'react';

class Letter extends React.Component {
  constructor(props){
    super(props);
  }

  renderLetter() {
    return this.props.letter === "q" ? "Qu" : this.props.letter.toUpperCase();
  }

  className() {
    if (this.props.playedLettersHash[this.props.coordinate]) {
      return "letter-clicked";
    }
    else {
      return "letter";
    }
  }



  render() {
    return(
      <div className = {this.className()} onClick = {() => this.props.updateCurrentWord(this.props.letter, this.props.coordinate)}>
        {this.renderLetter()}
      </div>
    );
  }
}

export default Letter;
