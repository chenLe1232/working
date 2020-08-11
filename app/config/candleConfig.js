export const dateMap = {
  // eslint-disable-next-line quote-props
  '1': '1m',
  // eslint-disable-next-line quote-props
  '3': '3m',
  // eslint-disable-next-line quote-props
  '5': '5m',
  // eslint-disable-next-line quote-props
  '15': '15m',
  // eslint-disable-next-line quote-props
  '30': '30m',
  // eslint-disable-next-line quote-props
  '60': '1h',
  // eslint-disable-next-line quote-props
  '120': '2h',
  // eslint-disable-next-line quote-props
  '240': '4h',
  // eslint-disable-next-line quote-props
  '360': '6h',
  // eslint-disable-next-line quote-props
  '720': '12h',
  // eslint-disable-next-line quote-props
  'D': '1d',
  // eslint-disable-next-line quote-props
  'W': '1w',
  // eslint-disable-next-line quote-props
  'M': '1m',
};

const overridesProps = (style) => ({
  volumePaneSize: 'medium',

  'scalesProperties.lineColor': style.text,
  'scalesProperties.textColor': style.text,
  'paneProperties.background': style.bg,
  'paneProperties.vertGridProperties.color': style.grid,
  'paneProperties.horzGridProperties.color': style.grid,
  'paneProperties.crossHairProperties.color': style.cross,
  'paneProperties.legendProperties.showLegend': false,
  'paneProperties.topMargin': 20,

  'mainSeriesProperties.candleStyle.upColor': style.up,
  'mainSeriesProperties.candleStyle.downColor': style.down,
  'mainSeriesProperties.candleStyle.drawWick': true,
  'mainSeriesProperties.candleStyle.drawBorder': true,
  'mainSeriesProperties.candleStyle.borderColor': style.border,
  'mainSeriesProperties.candleStyle.borderUpColor': style.up,
  'mainSeriesProperties.candleStyle.borderDownColor': style.down,
  'mainSeriesProperties.candleStyle.wickUpColor': style.up,
  'mainSeriesProperties.candleStyle.wickDownColor': style.down,
  'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

  'mainSeriesProperties.hollowCandleStyle.upColor': style.up,
  'mainSeriesProperties.hollowCandleStyle.downColor': style.down,
  'mainSeriesProperties.hollowCandleStyle.drawWick': true,
  'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
  'mainSeriesProperties.hollowCandleStyle.borderColor': style.border,
  'mainSeriesProperties.hollowCandleStyle.borderUpColor': style.up,
  'mainSeriesProperties.hollowCandleStyle.borderDownColor': style.down,
  'mainSeriesProperties.hollowCandleStyle.wickColor': style.line,

  'mainSeriesProperties.haStyle.upColor': style.up,
  'mainSeriesProperties.haStyle.downColor': style.down,
  'mainSeriesProperties.haStyle.drawWick': true,
  'mainSeriesProperties.haStyle.drawBorder': true,
  'mainSeriesProperties.haStyle.borderColor': style.border,
  'mainSeriesProperties.haStyle.borderUpColor': style.up,
  'mainSeriesProperties.haStyle.borderDownColor': style.down,
  'mainSeriesProperties.haStyle.wickColor': style.border,
  'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,

  'mainSeriesProperties.barStyle.upColor': style.up,
  'mainSeriesProperties.barStyle.downColor': style.down,
  'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
  'mainSeriesProperties.barStyle.dontDrawOpen': false,

  'mainSeriesProperties.lineStyle.color': style.up,
  'mainSeriesProperties.lineStyle.linewidth': 1,
  'mainSeriesProperties.lineStyle.priceSource': 'close',

  'mainSeriesProperties.areaStyle.color1': 'rgba(255, 255, 255, .1)',
  'mainSeriesProperties.areaStyle.color2': 'rgba(255, 255, 255, .02)',
  'mainSeriesProperties.areaStyle.linecolor': '#ffffff',
  'mainSeriesProperties.areaStyle.linewidth': 1,
  'mainSeriesProperties.areaStyle.priceSource': 'close',
});

// K线配置图 '#B8BAC5' #F6F6F6 ,暗黑主题色彩
export const switchDark = () => overridesProps({
  up: '#2DBD85',
  down: '#E0284A',
  bg: '#12151B',
  grid: '#18202f',
  cross: '#9194A3',
  border: '#282828',
  text: '#848D9B',
  areatop: 'rgba(122, 152, 247, .1)',
  areadown: 'rgba(122, 152, 247, .02)',
});

// K线主题配置,亮色主题
export const switchWhite = () => overridesProps({ // K线主题配置,亮色主题
  up: '#2DBD85',
  down: '#E0284A',
  bg: '#fff',
  grid: '#F3F3F3',
  cross: '#9194A3',
  border: 'rgba(0, 188, 212, 80)',
  text: 'rgba(0,0,0,0.32)',
  areatop: 'rgba(0, 188, 212, 5)',
  areadown: 'rgba(0, 188, 212, 0)',
});


export const disabledFeatures = [
  'compare_symbol',
  'display_market_status',
  'go_to_date',
  'header_saveload',
  'header_chart_type',
  'header_compare',
  'header_interval_dialog_button',
  'header_resolutions',
  'header_screenshot',
  'header_symbol_search',
  'header_undo_redo',
  'legend_context_menu',
  'show_interval_dialog_on_key_press',
  'snapshot_trading_drawings',
  'symbol_info',
  'timeframes_toolbar',
  'use_localstorage_for_settings',
  'volume_force_overlay',
  'header_widget',
  // 'display_market_status',
  // 'remove_library_container_border',
  // 'chart_property_page_style',
  // 'property_pages',
  // 'show_chart_property_page',
  // 'chart_property_page_scales',
  // 'chart_property_page_background',
  // 'chart_property_page_timezone_sessions',
  // 'symbol_info',
];

export const mobileDisabledFeatures = [
  'header_indicators',
  'header_fullscreen_button',
  'control_bar',
  'context_menus',
  'left_toolbar',
  'property_pages',
];

export const mobileEnabledFeatures = [
  'dont_show_boolean_study_arguments',
  'hide_last_na_study_output',
  'move_logo_to_main_pane',
  'same_data_requery',
  'side_toolbar_in_fullscreen_mode',
  'adaptive_logo',
  // 'header_widget_dom_node',
];

export const enabledFeatures = [
  'keep_left_toolbar_visible_on_small_screens',
];

export const studiesOverrides = {
  'volume.volume.color.0': 'rgba(224, 40, 74, 0.4)',
  'volume.volume.color.1': 'rgba(45, 189, 133, 0.4)',
  'volume.volume.transparency': 100,
  'volume.volume ma.color': '#589065',
  'volume.volume ma.plottype': 'line',
  'volume.volume ma.linewidth': 1,
  'volume.show ma': true,
};

// 研究线
export const mas = [
  {
    day: 5,
    color: '#9660C3',
    linewidth: 1,
  },
  {
    day: 10,
    color: '#85AAD4',
    linewidth: 1,
  },
  {
    day: 30,
    color: '#54B263',
    linewidth: 1,
  },
  {
    day: 60,
    color: '#B7238A',
    linewidth: 1,
  },
];

export const buttons = [
  {
    label: 'realtime',
    resolution: '1',
    chartType: 3,
  },
  {
    label: 'optionMinute',
    value: 1,
    resolution: '1',
  },
  {
    label: 'optionMinute',
    value: 5,
    resolution: '5',
  },
  {
    label: 'optionMinute',
    value: 15,
    resolution: '15',
  },
  {
    label: 'optionMinute',
    value: 30,
    resolution: '30',
  },
  {
    label: 'optionHour',
    value: 1,
    resolution: '60',
  },
  {
    label: 'optionHour',
    value: 4,
    resolution: '240',
  },
  {
    label: 'optionDay',
    resolution: 'D',
  },
  {
    label: 'week',
    resolution: 'W',
  },
];

export const mobileButtons = [
  {
    label: 'realtime',
    resolution: '1',
    chartType: 3,
  },
  {
    label: 'optionMinute',
    value: 1,
    resolution: '1',
  },
  {
    label: 'optionMinute',
    value: 5,
    resolution: '5',
  },
  {
    label: 'optionMinute',
    value: 15,
    resolution: '15',
  },
  {
    label: 'optionMinute',
    value: 30,
    resolution: '30',
  },
  {
    label: 'optionHour',
    value: 1,
    resolution: '60',
  },
  {
    label: 'optionHour',
    value: 4,
    resolution: '240',
  },
  {
    label: 'optionDay',
    resolution: 'D',
  },
  {
    label: 'week',
    resolution: 'W',
  },
];
