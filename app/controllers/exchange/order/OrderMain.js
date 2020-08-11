import React, { PureComponent } from 'react';
import OrderSubmit from './OrderSubmit';
import { connect } from 'react-redux';
import OrderLogin from './OrderLogin';
import { TabPane, Tabs, TabPaneSub} from '$components/kb-design/KTabs';
import Limit from './orderComponents/Limit';
import LimitOrder from './orderComponents/LimitOrder';
import Market from './orderComponents/Market';
import MarketOrder from './orderComponents/MarketOrder';
import debounce from 'lodash/debounce';



class OrderMain extends PureComponent {
  constructor() {
    super();
    this.dispatchActive = debounce(this.dispatchActive, 300);
  };

  dispatchActive = (v, fn) => {
    fn(v);
  };
  tabsOnChange=( index) => {
    const { setActiveSelect } = this.props;
    this.dispatchActive(Number(index), setActiveSelect);
  };
  
  render() {
    const {  isLogin, userLever } = this.props;
    return (
      <>
        <div className="order-main">
          <div className="price-tabs">
            <Tabs onSelect={(index) =>{ this.tabsOnChange(index)}}>
              <TabPane tab="限价" >
                <Limit />
              </TabPane>
              <TabPane tab="市价"> 
                <Market />
              </TabPane>
              <TabPaneSub keys='2'>
                <TabPane tab="限价委托">
                  <LimitOrder />
                </TabPane>
                <TabPane tab="市价委托">
                  <MarketOrder />
                </TabPane>
              </TabPaneSub>
            </Tabs>
          </div>
        </div>
        {isLogin ? <OrderSubmit  userLever={userLever}  />
                 : <OrderLogin />
        }
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  isLogin: state.login.userInfo,
})
const mapDispatch = (dispatch) => ({
  setActiveSelect: dispatch.tabs.setActiveSelect,
})
export default connect(mapStateToProps, mapDispatch)(OrderMain);
