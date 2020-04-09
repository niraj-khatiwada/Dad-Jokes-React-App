import React, { Component } from 'react'
import './Joke.css'

class Joke extends Component {
  constructor(props) {
    super(props)
  }
  handleUpvote = () => {
    return this.props.handleUpvoteClick()
  }
  handleDownvote = () => {
    return this.props.handleDownvoteClick()
  }
  render() {
    return (
      <div className="Joke">
        <div className="Joke-grid">
          <div className="vote-btn">
            <i
              className="fas fa-arrow-up upVote"
              onClick={this.handleUpvote}
            ></i>
            <button
              className="voteCount"
              style={{
                border: `3px solid ${this.props.votesBorderColor}`,
              }}
            >
              {this.props.totalVotes}
            </button>
            <i
              className="fas fa-arrow-down downVote"
              onClick={this.handleDownvote}
            ></i>
          </div>
          <div className="joke">
            <p className="joke-text">{this.props.joke}</p>
          </div>
          <div className="emoji">{this.props.emoji}</div>
        </div>
      </div>
    )
  }
}

export default Joke
