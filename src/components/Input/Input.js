import React from 'react';
import './Input.css';
import Autocomplete from '../autocomplete/AutoComplete';
class Input extends React.Component {
  getOptionsHandler = (value, name) => {
    this.props.getOptions(value, name);
  };
  render() {
    return (
      <div className="col1">
        <div className="form-group">
          <div className="input-group">
            <label className="label-control input-group-addon">
              {this.props.label}
            </label>
            <Autocomplete
              getOptions={this.getOptionsHandler}
              name={this.props.name}
              suggestions={this.props.suggestions}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Input;
