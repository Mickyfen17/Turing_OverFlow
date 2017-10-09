import React, { Component } from 'react';
import SimpleMDE from 'simplemde';
import Alert from 'react-s-alert';

import Button from '../Button';
import NewTagLink from '../NewTagLink';

export default class AskQuestion extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      question: '',
      tagText: '',
      tags: [],
    };
    this.handleTagDelete = this.handleTagDelete.bind(this);
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
    if (tag.length < 1) {
      Alert.error('Please enter a value into the tag input');
    } else if (this.state.tags.length < 5) {
      this.setState({
        tags: this.state.tags.concat(tag),
        tagText: '',
      });
    } else {
      Alert.error('You have met the max limit for tags');
    }
  }

  inputChecker() {
    return ['title', 'question'].filter((value) => {
      if (!this.state[value].length) {
        Alert.error(`Please enter a value into the ${value} field`);
      } else {
        return value;
      }
    });
  }

  tagChecker() {
    const { tags } = this.state;

    if (tags < 1 || tags > 5) {
      Alert.error('Please add between 1 and 5 tags to the question');
      return false;
    }
    return true;
  }

  postQuestion(title, question, name, picture, tags) {
    const valuesEntered = this.inputChecker();
    const tagsChecker = this.tagChecker();

    if (valuesEntered.length === 2 && tagsChecker) {
      this.props.addQuestion(title, question, name, picture, tags)
        .then((response) => {
          this.props.storedHistory.push(`/question/${response.id}`);
        });
    }
  }

  renderTags() {
    return this.state.tags.map((tag, i) =>
      <NewTagLink key={i} name={ tag } handleDelete={ this.handleTagDelete }/>,
    );
  }

  handleTagDelete(tagName) {
    const filteredTags = this.state.tags.filter(tag => tag !== tagName);
    this.setState({ tags: filteredTags });
  }

  render() {
    const { title, question, tagText, tags } = this.state;
    const { user: { nickname, picture } } = this.props;
    const renderTags = this.renderTags();

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
            btnName="+"
            handleClick={ () => this.handleTags(tagText) }
          />
        </div>
        <div className="add-tags-wrapper">
          { tags.length !== 0 && (renderTags) }
        </div>
        <Button
          className="submit-question--btn"
          btnName="Submit Question"
          handleClick={ () => this.postQuestion(title, question, nickname, picture, tags) }
        />
      </div>
    );
  }
}
