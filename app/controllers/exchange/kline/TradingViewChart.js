import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import config from '$config/hostConfig';
import consts from '$consts';
import Datafeeds from './Datafeeds';
import { widget as TradingViewWidget } from '$lib/charting_library/charting_library.min';

import {
  dateMap,
  switchWhite,
  switchDark,
  disabledFeatures,
  mobileDisabledFeatures,
  mobileEnabledFeatures,
  enabledFeatures,
  studiesOverrides,
  mas,
  // buttons,
} from '$config/candleConfig';
//
import {
  changeIntervalCallback,
  openIndicatorsCallback,
  openSettingCallback,
} from '$controllers/exchange/chartArea/ChartTopBar';
// import {
//   mobileChangeIntervalCallback,
//   mobileOpenIndicatorsCallback,
//   // mobileOpenSettingCallback,
// } from '../Mobile/ChartTopBar';


// const messages = defineMessages({
//   realtime: {
//     id: 'exchange.kline.realtime',
//     defaultMessage: 'realtime',
//     description: '分时',
//   },
//   optionMinute: {
//     id: 'exchange.kline.optionMinute',
//     defaultMessage: '{value} Min',
//     description: '{value} 分',
//   },
//   optionHour: {
//     id: 'exchange.kline.optionHour',
//     defaultMessage: '{value} Hour',
//     description: '{value} 小时',
//   },
//   optionDay: {
//     id: 'exchange.kline.day',
//     defaultMessage: 'Day',
//     description: '日线',
//   },
//   week: {
//     id: 'exchange.kline.week',
//     defaultMessage: 'Week',
//     description: '周线',
//   },
//   month: {
//     id: 'exchange.kline.month',
//     defaultMessage: 'Month',
//     description: '月线',
//   },
// });


class TradingViewChart extends React.Component {
  widget = null;

  componentDidMount() {
    this.create();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.symbol !== nextProps.symbol) {
      return true;
    }
    // if (this.props.socket !== nextProps.socket) {
    //   return true;
    // }
    // if (this.props.lang !== nextProps.lang) {
    //   return true;
    // }
    if (this.props.theme !== nextProps.theme) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.widget._ready) {
      this.widget.remove();
    }
    this.create();
  }

  componentWillUnmount() {
    if (this.widget._ready) {
      this.widget.remove();
    }
  }

  create = () => {
    const {
      theme,
      lang,
      symbol,
      handleInterval,
      // intl,
      // mobile,
      // product,
      // granularity,
      // switchGranularity,
      // exchangeTheme,
    } = this.props;

    const mobile = false;
    const granularity = '15m';
    const exchangeTheme = 'light';
    const product = {
      symbol: 'BTC',
      code: 'BTC_USDT',
      maxPrice: 4,
      pairCode: 'BTC_USDT',
    };

    const interval = Object.keys(dateMap).filter((key) => dateMap[key] === granularity);

    this.widget = new TradingViewWidget({
      autosize: true,
      debug: false,
      symbol: symbol,
      interval,
      container_id: 'tv_chart_container',
      datafeed: new Datafeeds.UDFCompatibleDatafeedExchange({
        data_status: 'streaming',
        max_bars: 10080,
        description: symbol,
        exchange: consts.BRAND,
        'exchange-listed': '1',
        'exchange-traded': '1',
        force_session_rebuild: false,
        full_name: symbol,
        has_daily: true,
        has_empty_bars: false,
        has_intraday: true,
        has_weekly_and_monthly: true,
        minmov: 1,
        minmove2: 0,
        name: symbol,
        pricescale: 10 ** product.maxPrice,
        session: '24x7',
        volume_precision: 8,
        timezone: 'Asia/Shanghai',
        supports_marks: true,
        supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', 'D', '3D', 'W', 'M'],
        symbol: symbol,
        ticker: symbol,
        type: 'bitcoin',
        pairCode: symbol,
      }),
      library_path: `${config.sameOriginStatic}/lib/charting_library/`,
      custom_css_url: theme.name === 'light' ? 'white.css?timer=v0.0.1' : 'black.css?timer=v0.0.1',
      locale: lang,
      drawings_access: {
        type: 'black',
        tools: [{ name: 'Regression Trend' }],
      },
      disabled_features: mobile ? disabledFeatures.concat(mobileDisabledFeatures) : disabledFeatures,
      // disabled_features: disabledFeatures,
      enabled_features: mobile ? mobileEnabledFeatures : mobileEnabledFeatures.concat(enabledFeatures),
      studies_overrides: studiesOverrides,
      charts_storage_url: window.location.host,
      charts_storage_api_version: '1.1',
      toolbar_bg: 'transparent',
      timezone: 'Asia/Shanghai',
      overrides: theme.name === 'light' ? switchWhite() : switchDark(),
      theme: theme.name === 'light' ? 'Light' : 'Dark',
    });

    this.widget.MAStudies = [];
    this.widget.selectedIntervalButton = null;

    this.widget.onChartReady(() => {
      const chart = this.widget.chart();

      // if (isWidthUp('xl', width)) {
      //   chart.createStudy('MACD', false, false, [12, 26, 'close', 9], null, {
      //     'histogram.color.0': 'rgba(77, 184, 114, 0.8)',
      //     'histogram.color.1': '#ae4e54',
      //     'macd.color': '#f6751a',
      //     'signal.color': '#0c9bdf',
      //   });
      // }
      // if (mobile) {
      //   mobileChangeIntervalCallback((button) => {
      //     if (!this.widget.changingInterval) {
      //       const chartType = Number(button.chartType) || 1;
      //       const resolution = button.resolution;
      //
      //       if (chart.resolution() !== resolution) {
      //         this.widget.changingInterval = true;
      //         localStorage.interval = resolution;
      //         switchGranularity((prop(resolution)(dateMap)));
      //         chart.setResolution(resolution);
      //       }
      //       if (chart.chartType() !== chartType) {
      //         chart.setChartType(chartType);
      //       }
      //       // updateSelectedIntervalButton(button);
      //       // showMAStudies(chartType !== 3);
      //       this.widget.selectedIntervalButton = button;
      //     }
      //   });
      //
      //   mobileOpenIndicatorsCallback(() => {
      //     chart.executeActionById('insertIndicator');
      //   });
      // } else {
      changeIntervalCallback((button) => {
        if (!this.widget.changingInterval) {
          const chartType = Number(button.chartType) || 1;
          const resolution = button.resolution;

          if (chart.resolution() !== resolution) {
            this.widget.changingInterval = true;
            localStorage.interval = resolution;
            handleInterval(dateMap[resolution]);
            chart.setResolution(resolution);
          }
          if (chart.chartType() !== chartType) {
            chart.setChartType(chartType);
          }
          // updateSelectedIntervalButton(button);
          // showMAStudies(chartType !== 3);
          this.widget.selectedIntervalButton = button;
        }
      });
      
      openIndicatorsCallback(() => {
        chart.executeActionById('insertIndicator');
      });
      
      openSettingCallback(() => {
        chart.executeActionById('chartProperties');
      });
      // }

      mas.forEach((item) => {
        chart.createStudy(
          'Moving Average',
          false,
          false,
          [item.day],
          (entity) => {
            this.widget.MAStudies.push(entity);
          },
          {
            'plot.color': item.color,
            'plot.linewidth': item.linewidth,
          },
        );
      });
      //
      chart.onIntervalChanged().subscribe(null, () => {
        this.widget.changingInterval = false;
      });
    });
  }

  render() {
    return null;
  }
}


export default injectIntl(TradingViewChart);
