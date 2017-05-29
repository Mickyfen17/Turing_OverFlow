import React, { Component } from 'react';
import SimpleMDE from 'simplemde';

import Button from '../Button';
import '../../../node_modules/simplemde/dist/simplemde.min.css';

export default class AskQuestion extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      question: '',
      tagText: '',
      tags: [],
    };
  }

  componentDidMount() {
    const simplemde = new SimpleMDE({
      element: document.getElementById('editor'),
      placeholder: 'Type question here...',
    });
    simplemde.codemirror.on('change', () => {
      const question = simplemde.value();
      this.setState({ question });
    });
    simplemde.value(this.state.question);
  }

  handleInput(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  handleTags(tag) {
    this.setState({
      tags: this.state.tags.concat(tag),
      tagText: '',
    });
  }

  render() {
    const { title, tagText } = this.state;

    return (
      <div className="ask-question-wrapper">
        <h2 className="ask-question-header">Ask Question</h2>
        <div className="title-wrapper">
          <label>Title</label>
          <input
            className="title-input"
            placeholder="Enter your programming question"
            name="title"
            value={ title }
            minLength="15"
            maxLength="200"
            onChange={ e => this.handleInput(e) }
          />
        </div>
        <textarea id="editor" />
        <div className="tags-wrapper">
          <label>Tags</label>
          <input
            className="tag-input"
            placeholder="Enter a minimum of one tag"
            name="tagText"
            value={ tagText }
            minLength="15"
            maxLength="50"
            onChange={ e => this.handleInput(e) }
          />
          <Button
            className="tag--btn"
            name="+"
            handleClick={ () => this.handleTags(tagText) }
          />
        </div>
        <Button
          className="submit-question--btn"
          name="Submit Question"
        />
      </div>
    );
  }
}