import React from 'react';
import PorpTypes from 'prop-types';
// import classnames from 'classnames';
// require('./index.less')

const addPre = (val) => `kb-${val}`;
class Radio extends React.Component {
  render() {
    const { rkey, name, selectedValue, onChange, value, text } = this.props;
    const optional = {};
    if (selectedValue) {
      optional.checked = selectedValue === value;
    }
    // 禁用暂时不考虑
    if (typeof onChange === 'function') {
      optional.onChange = onChange;
    }

    return (
      <div key={rkey} className={addPre('radio')}>
        {/* fix/ add label   鼠标没能聚焦到input上 */}
        <label>
          <input
            type="radio"
            name={name || 'radioame'}
            checked={optional.checked || false}
            onChange={optional.onChange}
            value={value || 'value'}
            className={addPre('radio-input')}
          />
          <i />
          <span className={text ? addPre(detail) : ''}>
            {' '}
            {text}
          </span>
        </label>
      </div>
    );
  }
}

//* ******************************
//    lot radio
//* ******************************
class RadioGroup extends React.Component {
  // constructor(props){
  //   super(props)
  // }
  getOptions() {
    const { options } = this.props;
    if (!options) {
      return null;
    }
    return options.map((option) => {
      if (typeof option === 'string') {
        return {
          name: option,
          value: option,
          text: option,
        };
      }
      return option;
    });
  }

   renderRadio = () => {
   	const { selectedValue, onChange } = this.props;

   	const options = this.getOptions();
   	let child;
   	if (!options) {
   		return null;
   	}
   	child = options.map((option, index) => (
     <Radio
         rkey={`${index}item`}
         onChange={onChange}
         selectedValue={selectedValue}
         {...option}
       />
   	));
   	return child;
   }

   render() {
   	return (
     <div className={addPre('radio-group')}>
         {this.renderRadio() ? this.renderRadio() : <Radio {...this.props} />}
       </div>
   	);
   }
}


RadioGroup.propTypes = {
  name: PorpTypes.string,
  selectedValue: PorpTypes.string,
  onChange: PorpTypes.func,
  options: PorpTypes.array,
};

export { RadioGroup, Radio };
