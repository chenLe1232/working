import React from 'react';
import classNames from 'classnames';
import { injectIntl, defineMessages } from 'react-intl';
// import prop from 'ramda/es/prop';
import { dateMap } from '$config/candleConfig';

import { handleFullScreen as newFullScreen } from '$utils/fullScreen';

import Indicators from '$components/icons/Indicators';
import FullScreen from '$components/icons/FullScreen';
import Setting from '$components/icons/Setting';
import Container from '$components/kb-design/Container';

const styles = {
  chartButton: {
    borderTop: '1px solid',
    borderBottom: '1px solid',
    boxSizing: 'border-box',
    '&:hover + button': {
      borderLeft: '1px solid #F0B90A'
    },
  },
  selectOriginal: {
    '&:first-child': {
      color: '#F0B90A',
      borderLeft: '1px solid',
      borderRight: '1px solid',
      '&:hover': {
        borderRight: 'none'
      }
    },
    '&:nth-child(3)': {
      borderLeft: '1px solid',
      borderRight: '1px solid',
    },
  },
  selectTradingView: {
    '&:first-child': {
      borderLeft: '1px solid',
    },
    '&:nth-child(2)': {
      color: '#F0B90A',
      borderLeft: '1px solid',
      borderRight: '1px solid',
      '&:hover': {
        borderRight: 'none'
      }
    },
    '&:nth-child(3)': {
      borderRight: '1px solid',
    }
  },
  selectDepth: {
    '&:first-child': {
      borderLeft: '1px solid',
    },
    '&:nth-child(2)': {
      borderLeft: '1px solid',
    },
    '&:nth-child(3)': {
      color: '#F0B90A',
      borderLeft: '1px solid',
      borderRight: '1px solid',
    }
  }
};

const messages = defineMessages({
  original: {
    id: 'exchange.chartTopBar.original',
    defaultMessage: 'Original',
    description: '基本版',
  },
  tradingView: {
    id: 'exchange.chartTopBar.tradingView',
    defaultMessage: 'TradingView',
    description: '专业版',
  },
  depth: {
    id: 'exchange.chartTopBar.depth',
    defaultMessage: 'Depth',
    description: '深度图',
  },
  realtime: {
    id: 'exchange.kline.realtime',
    defaultMessage: 'Time',
    description: '分时',
  },
  optionMinute: {
    id: 'exchange.kline.optionMinute',
    defaultMessage: '{value} Min',
    description: '{value} 分',
  },
  optionHour: {
    id: 'exchange.kline.optionHour',
    defaultMessage: '{value} Hour',
    description: '{value} 小时',
  },
  optionDay: {
    id: 'exchange.kline.day',
    defaultMessage: 'Day',
    description: '日线',
  },
  week: {
    id: 'exchange.kline.week',
    defaultMessage: 'Week',
    description: '周线',
  },
  month: {
    id: 'exchange.kline.month',
    defaultMessage: 'Month',
    description: '月线',
  },
});

let changeInterval; // 用来接收tradingView中的方法
let openIndicators; // 指标弹窗
let openSetting; // 设置弹窗

class ChartTopBar extends React.Component {
  state = {
    selectTime: 'min15',
    browser: "unknow",
    isFullScreen: false
  }

  componentDidMount() {
    const that = this;
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    if (userAgent.indexOf('Firefox') > -1) { // 判断是否Firefox浏览器
      this.setState({
        browser: 'Firefox',
      });
      document.addEventListener('mozfullscreenchange', () => { // firefox
        that.setState({
          isFullScreen: !that.state.isFullScreen,
        });
      }, false);
    } else if (userAgent.indexOf('Chrome') > -1) {
      this.setState({
        browser: 'Chrome',
      });
      document.addEventListener('webkitfullscreenchange', () => { // chrome
        that.setState({
          isFullScreen: !that.state.isFullScreen,
        });
      }, false);
    } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1) { // 判断是否IE11浏览器
      this.setState({
        browser: 'IE11',
      });
      document.addEventListener('msfullscreenchange', () => { // ie11
        that.setState({
          isFullScreen: !that.state.isFullScreen,
        });
      }, false);
    } else {
      document.addEventListener('fullscreenchange', () => { // w3c
        that.setState({
          isFullScreen: !isFullScreen,
        });
      }, false);
    }
  }

  componentWillUnmount() {
    switch (this.state.browser) {
      case 'Firefox':
        document.removeEventListener('mozfullscreenchange', () => { }, false);
        break;
      case 'Chrome':
        document.removeEventListener('webkitfullscreenchange', () => { }, false);
        break;
      case 'IE11':
        document.removeEventListener('msfullscreenchange', () => { }, false);
        break;
      default:
        document.removeEventListener('fullscreenchange', () => { }, false);
        break;
    }
  }

  handleSelectTime(selectTime) {
    const { chartType, load, product, switchGranularity, handleChartType } = this.props
    this.setState({
      selectTime: selectTime.id
    })
    if (chartType === 'tradingView') {
      changeInterval && changeInterval(selectTime)
    }
    //  else if (chartType === 'original') {
    //   if (selectTime.id === 'time') {
    //     handleChartType('area')
    //   } else {
    //     handleChartType('kline')
    //   }
    //   load(product, prop(selectTime.resolution)(dateMap))
    // }
    // switchGranularity(prop(selectTime.resolution)(dateMap))
  }

  render() {
    const {
      intl,
      chartType,
      handleChartType,
      node,
    } = this.props;
    const { isFullScreen } = this.state;

    const MAStudies = intl => ([
      {
        id: 'time',
        msg: intl.formatMessage(messages.realtime),
        label: 'realtime',
        resolution: '1',
        chartType: 3,
      },
      {
        id: 'min1',
        msg: intl.formatMessage(messages.optionMinute, { value: 1 }),
        label: 'optionMinute',
        value: 1,
        resolution: '1',
      },
      {
        id: 'min5',
        msg: intl.formatMessage(messages.optionMinute, { value: 5 }),
        label: 'optionMinute',
        value: 5,
        resolution: '5',
      },
      {
        id: 'min15',
        msg: intl.formatMessage(messages.optionMinute, { value: 15 }),
        label: 'optionMinute',
        value: 15,
        resolution: '15',
      },
      {
        id: 'min30',
        msg: intl.formatMessage(messages.optionMinute, { value: 30 }),
        label: 'optionMinute',
        value: 30,
        resolution: '30',
      },
      {
        id: 'hour1',
        msg: intl.formatMessage(messages.optionHour, { value: 1 }),
        label: 'optionHour',
        value: 1,
        resolution: '60',
      },
      {
        id: 'hour4',
        msg: intl.formatMessage(messages.optionHour, { value: 4 }),
        label: 'optionHour',
        value: 4,
        resolution: '240',
      },
      {
        id: 'day1',
        msg: intl.formatMessage(messages.optionDay),
        label: 'optionDay',
        resolution: 'D',
      },
      {
        id: 'week1',
        msg: intl.formatMessage(messages.week),
        label: 'week',
        resolution: 'W',
      },
      {
        id: 'month1',
        msg: intl.formatMessage(messages.month),
        label: 'month',
        resolution: 'M',
      },
    ]);

    const chartOptions = intl => ([
      {
        msg: intl.formatMessage(messages.tradingView),
        type: 'tradingView',
      },
      {
        msg: intl.formatMessage(messages.depth),
        type: 'depth',
      },
    ]);

    const MAStudiesList = MAStudies(intl).map((item) => {
      return (
        <button key={item.id} className="studies-item" style={{ color: this.state.selectTime === item.id ? '#F0B90A' : '' }}
          onClick={() => { this.handleSelectTime(item) }}>
          {item.msg}
        </button>
      );
    });

    const chartList = chartOptions(intl).map((item) => {
      return (
        <button className={classNames("studies-item", "chart-button")}
         key={item.type} onClick={() => { handleChartType(item.type) }}>
          {item.msg}
        </button>
      );
    });

    return (
      <Container flex justify="space-between" className="chart-topbar" style={{ flexDirection: chartType !== 'depth' ? 'row' : 'row-reverse' }}>
        {chartType !== 'depth' &&
          <Container flex>
            {MAStudiesList}
            {chartType === 'tradingView' && <button className="studies-item" onClick={() => { openIndicators && openIndicators() }}>
              <Indicators />
            </button>}
            {chartType === 'tradingView' && <button className="studies-item" onClick={() => { openSetting && openSetting() }}>
              <Setting />
            </button>}
            <button className="studies-item" onClick={() => { this.props.handleFull(isFullScreen); newFullScreen(node.current) }}>
              <FullScreen />
            </button>
          </Container>}
        {!isFullScreen &&
          <Container className={chartType==="tradingView" ? "select-tradingView" : "select-depth"}>
            {chartList}
          </Container>}
      </Container>
    );
  }
}

export const changeIntervalCallback = (callback) => {
  changeInterval = callback;
};

export const openIndicatorsCallback = (callback) => {
  openIndicators = callback;
};

export const openSettingCallback = (callback) => {
  openSetting = callback;
};

export default injectIntl(ChartTopBar);
