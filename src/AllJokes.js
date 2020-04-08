import React, { Component } from 'react'
import './AllJokes.css'
import Joke from './Joke'

import axios from 'axios'

class AllJokes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      joke: [],
      emoji: '🙂',
    }
    this.VoteClick = this.VoteClick.bind(this)
  }
  static defaultProps = {
    listNum: 10,
    emojis: {
      normal: '🙂',
      funny: '😄',
      extraFunny: '😆',
      stopIt: '😂',
      iAmGonnaCry: '🤣',
    },
  }
  async componentDidMount() {
    let jokesArray = []
    while (jokesArray.length < this.props.listNum) {
      await axios
        .get('https://icanhazdadjoke.com/', {
          headers: {
            Accept: 'application/json',
          },
        })
        .then((res) => {
          jokesArray.push({
            id: res.data.id,
            jokeText: res.data.joke,
            totalVotes: 0,
          })
        })
    }
    this.setState({ joke: jokesArray })
  }

  VoteClick(jokeID, delta) {
    this.setState((preState) => {
      return {
        joke: preState.joke.map((j) => {
          if (j.id === jokeID) {
            return { ...j, totalVotes: j.totalVotes + delta }
          } else {
            return j
          }
        }),
      }
    })
  }

  render() {
    let jokesArrayExtract = this.state.joke.map((jokeData) => {
      return (
        <Joke
          key={jokeData.id}
          joke={jokeData.jokeText}
          totalVotes={jokeData.totalVotes}
          handleUpvoteClick={this.VoteClick.bind(this, jokeData.id, 1)}
          handleDownvoteClick={this.VoteClick.bind(this, jokeData.id, -1)}
          emoji={this.state.emoji}
        />
      )
    })
    return (
      <div className="AllJokes">
        <div className="Alljokes-grid">
          <div className="title">
            <h1>Dad Jokes</h1>
          </div>
          <div className="btn">
            <button className="newjokes-btn">New Jokes</button>
          </div>
        </div>
        <div className="JokesList">{jokesArrayExtract}</div>
      </div>
    )
  }
}

export default AllJokes
