// import 'rc-slider/assets/index.css';
import '$styles/exchange/order/slider/index.css';
import '$styles/exchange/order/slider/bootstrap.css';
// import 'rc-tooltip/assets/bootstrap.less';
import '$styles/exchange/order/slider/slider.less';
import React, { Component} from 'react';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const Handle = Slider.Handle;

const handle = (props) => {
	const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      id="slider-tooltip"
      trigger={['click','hover','focus']}
      prefixCls="rc-slider-tooltip"
      overlay={<span>{value+'X'}</span>}
      visible={true}
      placement="top"
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

// const marks = {
//   1: '1X',
//   25: '25X',
//   50: '50X',
//   75: '75X',
//   100: '100X'
// };

export default class ReactSlider extends Component {
		static defaultProps = {
		  onChange: v => v,
			lever: 20,
			marks : {
				1: '1X',
				25: '25X',
				50: '50X',
				75: '75X',
				100: '100X'
			},
		}

		constructor(props) {
			super(props);
		  this.state = {
		    lever: props.lever
		  };
		}

		onChange(val) {
		  if(val !== this.state.lever) {
		    this.setState({
		      lever: val
		    }, () => this.props.onChange(val));
		  }
		}

		render() {
			const { lever, marks, max } = this.props;
		  return (
        <div 
          className="widget-slider">
		      <Slider
		        onChange={(val) => this.onChange(val)}
		        min={1}
		        max={max}
		        marks={marks}
		        value={lever}
		        handle={handle}
		      />
		    </div>
		  );
		}
}