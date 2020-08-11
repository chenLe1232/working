import '$styles/exchange/order/slider/lever.less';
import React, { createRef } from 'react';
import ReactSlider from './ReactSlider';
import Button from '$components/kb-design/Button';
import { connect } from 'react-redux';
import store from '$store';
import findMarks from '$lib/order/findMarks';


class Lever extends React.Component{
  constructor(){
    super();
    this.state={
      lever: '20',
      marks: {},
      max: 100,
    }
    this.leverRef = createRef();
    this.clickOutSide = this.clickOutSide.bind(this);
  };

  static getDerivedStateFromProps(nextProps, prevState){
    const { currentAssetd } = nextProps;
    const {marks, max} = findMarks(currentAssetd);
    const marksLength = Object.keys(prevState.marks).length;
    if(!marksLength && marks){
      return {
        marks,
        max,
      }
    }
    return null;
  }
  componentDidMount(){
    document.body.style.overflow='hidden';
    document.body.addEventListener('click', this.clickOutSide);
  }
  componentWillUnmount(){
    document.body.style.overflow='visible';
    document.body.removeEventListener('click', this.clickOutSide)
  }
  clickOutSide = (e) => {
    const { leverClick } = this.props;
    if( !this.leverRef.current.contains(e.target) && this.leverRef.current){
      leverClick(e)
    }
  };

  handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d\.]/g, '');
    if(value > 100){
      value = 100
    } else if( value === ''){
      value = 1
    } ;
    this.setState({
      lever: value
    });
  };

  clickAdd = (e) => {
    e.preventDefault && e.preventDefault();
    this.setState((preState) => ({
      lever: Number(preState.lever) + 1
    }));
  };

  clickSub = (e) => {
    e.preventDefault && e.preventDefault();
    this.setState((preState) => ({
      lever: Number(preState.lever) - 1
    }));
  };

  sliderChange = (val) => {
    this.setState({
      lever: val,
    });
  };

  handleClick = () => {
    const {leverClick, setUserLever } = this.props;
    const { lever } = this.state;
    setUserLever(lever);
    if(leverClick){
      leverClick();
    }
  }
  
  render() {
    const { lever, marks, max } = this.state;
    return(
      <div className="lever">
        <div className="lever-wrap" ref={this.leverRef}>
          <div className="lever-title">
              <span className="title">调整杆杠</span>
              <span className="title-icon" onClick={this.props.leverClick}>
                {/* <NavFavorites /> */}
                X
              </span>
          </div>
          <div className="input-wrap">
            <Button 
              className="add"
              onClick={this.clickSub}
            >
              -
            </Button>
            <div className="input-content">
              <input  
                className="input-1"
                value={lever}
                onChange={this.handleChange}
              />
              <span className="suffix">X</span>
            </div>
            <Button 
              className='sub'
              onClick={this.clickAdd}
            >
              +
            </Button>
          </div>
          <div className="slider">
            <ReactSlider lever={lever} max = {max} marks = { marks} onChange={ (val) => {this.sliderChange(val)}} />
          </div>
          <Button
            className="confirm"
            onClick={this.handleClick}
            >
              确认
          </Button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  currentAssetd: store.select.ticker.mergeTick(state.ticker),
});
const madDispatch = (dispatch) => ({
  setUserLever: dispatch.tabs.setUserLever,
})
export default connect(mapStateToProps, madDispatch)(Lever);