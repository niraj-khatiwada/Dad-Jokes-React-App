import React, { Component } from 'react'
import './AllJokes.css'
import Joke from './Joke'

import { v4 as uuid } from 'uuid'
import axios from 'axios'

class AllJokes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      joke:
        window.localStorage.getItem('joke') !== null
          ? JSON.parse(window.localStorage.getItem('joke'))
          : [],
      loading: false,
    }
    this.noDuplicateJokes = new Set(
      this.state.joke.map((value) => {
        return value.jokeText
      })
    )
    this.handleNewJokeClick = this.handleNewJokeClick.bind(this)
  }
  static defaultProps = {
    listNum: 10,
    emojis: {
      normal: '🙂',
      funny: '😄',
      extraFunny: '😆',
      stopIt: '😂',
      iAmGonnaCry: '🤣',
      sad: '☹️',
    },
    votesBorderColor: {
      normal: '#fcf7bb',
      funny: '#deff8b',
      extraFunny: '#c0ffb3',
      stopIt: '#7fcd91',
      iAmGonnaCry: '#21bf73',
      sad: '#e6a157',
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
          if (!this.noDuplicateJokes.has(res.data.joke)) {
            jokesArray.push({
              id: uuid(),
              jokeText: res.data.joke,
              totalVotes: 0,
              emoji: '🙂',
              votesBorderColor: '#fcf7bb',
            })
          }
        })
        .catch((err) => {
          alert('Something is wrong with server', err)
        })
    }
    this.setState((preState) => {
      window.localStorage.setItem('joke', JSON.stringify(jokesArray))
      return { joke: [...preState.joke, ...jokesArray], loading: false }
    })
  }

  VoteClick(jokeID, delta) {
    this.setState(
      (preState) => {
        let emo
        let borderColor
        let newState
        let unsortedArray = preState.joke.map((j) => {
          if (j.id === jokeID) {
            newState = j.totalVotes + delta
            if (newState >= 2 && newState < 4) {
              emo = this.props.emojis.funny
              borderColor = this.props.votesBorderColor.funny
            } else if (newState >= 4 && newState < 6) {
              emo = this.props.emojis.extraFunny
              borderColor = this.props.votesBorderColor.extraFunny
            } else if (newState >= 6 && newState < 8) {
              emo = this.props.emojis.stopIt
              borderColor = this.props.votesBorderColor.stopIt
            } else if (newState >= 8) {
              emo = this.props.emojis.iAmGonnaCry
              borderColor = this.props.votesBorderColor.iAmGonnaCry
            } else if (newState < 0) {
              emo = this.props.emojis.sad
              borderColor = this.props.votesBorderColor.sad
            } else {
              emo = this.props.emojis.normal
              borderColor = this.props.votesBorderColor.normal
            }
            newState = newState = {
              ...j,
              totalVotes: newState,
              emoji: emo,
              votesBorderColor: borderColor,
            }

            return newState
          } else {
            return j
          }
        })
        let sortedArray = unsortedArray.sort((a, b) => {
          return b.totalVotes - a.totalVotes
        })
        window.localStorage.setItem('joke', JSON.stringify(sortedArray))
        return { joke: sortedArray }
      },
      () => {
        window.localStorage.setItem('joke', JSON.stringify(this.state.joke))
      }
    )
  }
  handleNewJokeClick() {
    this.setState({ loading: true }, () => this.componentDidMount())
  }
  render() {
    let jokesArrayExtract = this.state.joke.map((jokeData) => {
      return (
        <Joke
          key={uuid()}
          joke={jokeData.jokeText}
          totalVotes={jokeData.totalVotes}
          handleUpvoteClick={this.VoteClick.bind(this, jokeData.id, 1)}
          handleDownvoteClick={this.VoteClick.bind(this, jokeData.id, -1)}
          emoji={jokeData.emoji}
          votesBorderColor={jokeData.votesBorderColor}
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
            <button
              className={`newjokes-btn ${this.state.loading}`}
              onClick={this.handleNewJokeClick}
            >
              {this.state.loading === true ? 'Loading...' : 'New Jokes'}
            </button>
          </div>
        </div>
        <div className="JokesList">{jokesArrayExtract}</div>
      </div>
    )
  }
}

export default AllJokes
