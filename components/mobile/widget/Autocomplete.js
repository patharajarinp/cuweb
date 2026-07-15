import Router from "next/router";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { withTranslation } from '../../../utils/i18n';
class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      search_text: ''
    };
    this.myRef = React.createRef();
  }

  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: false, //showSuggestions: true จะทำautocomplete มาเปิดเจ้านี้ตามนี้ด้วยนะ,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };
  onClickCancel = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });
  };
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        // userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onClickCancel,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;
    const {t} = this.props;
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleRedirect()
      }
    }
    const handleRedirect = (event) => {
      let url = '/categories', symbol = '?'
      url += symbol + 'text=' + userInput

      Router.push(url);
    };

    let suggestionsListComponent;
    let inputComponent;
    let inputarea;
    let btncancel;
    if (showSuggestions && userInput) {
      inputComponent = ("area-input");
      inputarea=("box-search-hasinput");
      btncancel=(<h4 className="text-pink my-auto ml-3" onClick={onClickCancel}>{t("mobile_header:cancel")}</h4>);
      if (filteredSuggestions.length) {

       
        suggestionsListComponent = (
          <div className="area-rerult">
            <ul className="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;

                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }

                return (
                  <li className={className} key={suggestion} onClick={onClick}>
                    <p classNamme="text-black my-auto">{suggestion}</p> <img className="img-fluid my-auto" src="/mobile/image/icon/icon-arrow-link.svg"/>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else {
        suggestionsListComponent = (
          <div className="area-rerult">
            <div className="no-suggestions">
              <em className="ml-3">{t("mobile_header:data_not_found")}</em>
            </div>
          </div>
        );
      }
    } else {
      inputComponent =("");
      inputarea=("box-search w-100");
      btncancel=("")
    }

    return (
      <Fragment>
        {inputComponent}
        <div className= {inputComponent}>
          <div className={inputarea}>
            <div className="icon-search">
              <img src={'/mobile/image/icon/icon-search.svg'} alt="ศูนย์หนังสือจุฬาฯ" />
            </div>
            <input type="text"
              onChange={onChange}
              onKeyPress={handleKeyPress}
              onKeyDown={onKeyDown}
              value={userInput} placeholder={t("mobile_header:type_book_name_author")} className="autocomplete-input"  />
          </div> 
         { btncancel}
          </div>

        {suggestionsListComponent}


      </Fragment>
    );
  }
}

export default withTranslation('mobile_header')(Autocomplete);
