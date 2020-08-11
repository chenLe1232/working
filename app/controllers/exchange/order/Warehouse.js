import React, { createRef } from 'react';
import classNames from 'classnames';
import Button from '$components/kb-design/Button';
import { connect } from 'react-redux';


class Warehouse extends React.Component {
  constructor() {
    super();
    this.state = {
      isBtnShow: false,
    };
    this.warehouseRef = createRef();
    this.confirmBtnClick = this.confirmBtnClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount(){
    document.body.addEventListener('click', this.handleClickOutside);
  };

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClickOutside);
  };
  btnClick = () => {
    this.setState((pre) => ({
      isBtnShow: !pre.isBtnShow,
    }))
  };
  handleClickOutside = (e) => {
    const { warehouseClick } = this.props;
    if (!this.warehouseRef.current.contains(e.target) && this.warehouseRef.current) {
      warehouseClick(e);
    }
  };
  confirmBtnClick = (e) => {
    const { warehouseClick, setQuancang } = this.props,
          { isBtnShow } = this.state;
    warehouseClick(e);
    if(isBtnShow){
      setQuancang(1);
      return null;
    };
    setQuancang(0);
  }

  render() {
    const { warehouseClick } = this.props;
    const { isBtnShow } = this.state;
    const btnShow = classNames('warehouse-button', {
      'warehouse-button-active': isBtnShow,
    });
    const btnNotShow = classNames('warehouse-button', {
      'warehouse-button-active': !isBtnShow,
    });
    const iconShow = classNames('icon', {
      'icon-active': !isBtnShow,
    });
    const iconNotShow = classNames('icon', {
      'icon-active': isBtnShow,
    });
    return (
      <div className="warehouse">
        <div className="warehouse-wrap" ref={this.warehouseRef}>
          {/* 头部 */}
          <div className="warehouse-title">
            <span className="title">BTCUSDT保证金模式</span>
            <span className="title-icon" onClick={warehouseClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-911prc"><path d="M13.4 12l6.6 6.6-1.4 1.4-6.6-6.6L5.4 20 4 18.6l6.6-6.6L4 5.4 5.4 4l6.6 6.6L18.6 4 20 5.4 13.4 12z" fill="currentColor" /></svg>
            </span>
          </div>
          {/* button */}
          <div className="warehouse-box">
            <div className="position">
              <div>
                <Button
                  btnType="default"
                  className={btnShow}
                  onClick={this.btnClick}
                >
                  全仓
                </Button>
                <span
                  className={iconShow}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-zqlgkb"><path d="M19.068 4.932A9.917 9.917 0 0012 2a9.917 9.917 0 00-7.068 2.932A9.917 9.917 0 002 11.988C2 17.521 6.479 22 12 22a9.917 9.917 0 007.068-2.932A9.992 9.992 0 0022 11.988a9.918 9.918 0 00-2.932-7.056zm-8.912 12.234L5.71 12.71l1.42-1.42 3.025 3.024 6.7-6.713 1.421 1.42-8.121 8.145z" fill="currentColor" /></svg>
                </span>
              </div>
            </div>
            <div className="position">
              <Button
                btnType="default"
                className={btnNotShow}
                onClick={this.btnClick}
              >
                逐仓
              </Button>
              <span
                className={iconNotShow}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-zqlgkb"><path d="M19.068 4.932A9.917 9.917 0 0012 2a9.917 9.917 0 00-7.068 2.932A9.917 9.917 0 002 11.988C2 17.521 6.479 22 12 22a9.917 9.917 0 007.068-2.932A9.992 9.992 0 0022 11.988a9.918 9.918 0 00-2.932-7.056zm-8.912 12.234L5.71 12.71l1.42-1.42 3.025 3.024 6.7-6.713 1.421 1.42-8.121 8.145z" fill="currentColor" /></svg>
              </span>
            </div>
          </div>
          {/* 合约描述 */}
          <div className="detail">
            调整保证金模式仅对当前合约生效。
          </div>
          <div className="descript-title">
            什么是全仓和逐仓模式？
          </div>
          <div className="position-mode">
            全仓保证金模式: 所有仓位共用合约账户中的保证金来避免仓位被强平。在强平事件中，交易者可能会损失所有的保证金和仓位。
          </div>
          <div className="position-mode margin">
            逐仓保证金模式: 一定数量保证金被分配到仓位上。如果仓位保证金亏损到低于维持保证金的水平，仓位将被强平。在逐仓模式下，您可以为这个仓位添加和减少保证金。
          </div>
          <div className="warehouse-confirm">
            <Button
              onClick={(e) => this.confirmBtnClick(e)}
              className="warehouse-confirm-button"
            >
              确认
            </Button>
          </div>
        </div>
      </div>
    );
  }
};
const mapDispatch = (dispatch) => ({
  setQuancang: dispatch.tabs.setQuancang,
})

export default connect(null, mapDispatch)(Warehouse);
