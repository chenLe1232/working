import '../styles/publicComponents/table.css';
import React, { Component } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import format from '../utils/format';
import NoData from './NoData';

const defaultColSetting = {
  key: null,
  title: null,
  width: null,
  sortable: true,
  sortfetch: true,
  template: null,
  format: (v) => v,
  render: (fmtVal, rowData, rowInd, colInd, rows) => fmtVal,
};

const normalizeWidth = (width) => {
  if (width === undefined) {
    return 'auto';
  }
  if (typeof width === 'number') {
    return `${width}%`;
  }
  return width;
};

export default class Table extends Component {
	static defaultProps = {
	  data: [],
	  showCols: true,
	  viewOptions: {
	    helpers: {
	      format: format,
	    },
	  },
	  columns: [{
	    key: 1,
	    width: 20,
	  }, {
	    key: 2,
	    width: 20,
	  }],
	  sortKey: null,
	  filterFn: (row) => true,
	  isSelected: false,
	  getSelections: (v) => v,
	  isRadio: true,
	  selectedRows: [],
	  sortFetchKey: null,
	  getSortKey: (v) => v,
	  className: null,
	}

	constructor(props, context) {
	  super(props, context);
	  this.state = {
	    selectedRows: props.selectedRows || [],
	    sortAscending: props.sortAscending || 1,
	    sortKey: props.sortKey || null,
	    sortFetchKey: props.sortFetchKey || null,
	    data: this.props.data || [],
	  };
	}

	componentDidMount() {
	  if (this.state.sortKey) {
	    if (this.state.sortAscending > 0) {
	      this.setState({
	        data: _.sortBy(this.state.data, (i) => i[this.state.sortKey], this).reverse(),
	      });
	    } else {
	      this.setState({
	        data: _.sortBy(this.state.data, (i) => i[this.state.sortKey], this),
	      });
	    }
	  }
	}

	componentWillReceiveProps(nextProps) {
	  this.setState({
	    sortAscending: nextProps.sortAscending || this.state.sortAscending,
	    sortKey: nextProps.sortKey || this.state.sortKey,
	    data: nextProps.data || this.state.data,
	    column: nextProps.columns || this.state.column,
	  }, () => {
	    if (this.state.sortKey) {
	      if (this.state.sortAscending > 0) {
	        this.setState({
	          data: _.sortBy(this.state.data, (i) => i[this.state.sortKey]).reverse(),
	        });
	      } else {
	        this.setState({
	          data: _.sortBy(this.state.data, (i) => i[this.state.sortKey]),
	        });
	      }
	    }
	  });
	}

	rowClick(row, rowInd) {
	  const { isSelected } = this.props;
	  let { selectedRows } = this.state;
	  if (isSelected) {
	    if (this.props.isRadio) {
	      selectedRows = [row];
	    } else if (!_.find(selectedRows, row)) {
	      selectedRows.push(row);
	    } else {
	      selectedRows = _.filter(selectedRows, (r) => {
	        return !_.isEqual(r, row);
	      });
	    }
	    this.props.getSelections(selectedRows);
	    this.setState({
	      selectedRows: selectedRows,
	    });
	  }
	  if (this.props.rowClick) {
	    this.props.rowClick(row, rowInd);
	  }
	}

	handleSort(key) {
	  this.setState({
	    sortAscending: this.state.sortAscending * (-1),
	    sortKey: key,
	  }, () => {
	    if (this.state.sortAscending > 0) {
	      this.setState({
	        data: _.sortBy(this.state.data, (i) => i[key]).reverse(),
	      });
	    } else {
	      this.setState({
	        data: _.sortBy(this.state.data, (i) => i[key]),
	      });
	    }
	  });
	}

	handleSortFetch(key) {
	  if (this.state.sortFetchKey === key) {
	    this.props.getSortKey(`-${key}`);
	  } else {
	    this.props.getSortKey(key);
	  }
	  this.setState({
	    sortFetchKey: key,
	  });
	}

	render() {
	  return (
  <div className={cx('table-root flex-col-1', this.props.className)} style={{ minHeight: 10 }}>
  {
	        (this.props.showCols) ? (
  <div className="table-header">
  <table className="table table-fixed table-sortable">
  <colgroup>
  {
	                  this.props.columns.map((col, colInd) => {
	                    return (
  <col
  key={col.key}
  style={{
	                          width: normalizeWidth(col.width),
	                        }}
	                      />
	                    );
	                  })
	                }
	              </colgroup>
  <thead>
  <tr>
  {
	                    this.props.columns.map((col, colInd) => {
	                      return (
  <th
  key={col.key}
  onClick={col.sortable ? this.handleSort.bind(this, col.key) : col.sortfetch ? this.handleSortFetch.bind(this, col.key) : null}
	                        >
  <div className={cx({
	                            sortable: col.sortable || col.sortfetch,
	                          })}
	                          >
  <span className="col-title" title={col.title}>{col.title}</span>
  {
	                              col.sortable ? (
  <span
  key={`${col.key}down`} className={cx({
	                                  'sort-icon iconfont': true,
	                                  'sort-icon-hide': col.key !== this.state.sortKey,
	                                })} dangerouslySetInnerHTML={{ __html: this.state.sortAscending === 1 ? '&#xe656;' : '&#xe676;' }}
	                                ></span>
	                              ) : null
	                            }
	                          </div>
	                        </th>
	                      );
	                    })
	                  }
	                </tr>
	              </thead>
	            </table>
	          </div>
	        ) : null
	      }
  <div className="flex-col-1 relative">
  <div className="flex-col-1 fullpanel">
  <table className="table table-fixed table-striped table-hover">
  <colgroup>
  {
	                this.props.columns.map((col, colInd) => {
	                  return (
  <col
  key={col.key}
  style={{
	                        width: normalizeWidth(col.width),
	                      }}
	                    />
	                  );
	                })
	              }
	            </colgroup>
  <tbody>
  {
	                this.props.error ? (
	                  this.renderError()
	                ) : (
	                  this.state.data.length > 0 ? (
	                    this.state.data.map((row, rowInd, rows) => {
	                      return this.renderRow(row, rowInd, rows);
	                    })
	                  ) : (
  <tr style={{ borderBottom: 'none', background: 'transparent' }}>
  <td colSpan={this.props.columns.length}>
  <NoData height="100%" />
	                      </td>
	                    </tr>
	                  )
	                )
	              }
	            </tbody>
	          </table>
	        </div>
	      </div>
	    </div>
	  );
	}

	renderRow(row, rowInd, rows) {
	  return this.props.filterFn(row) ? (
  <tr key={rowInd} onClick={this.rowClick.bind(this, row, rowInd)} className={_.find(this.state.selectedRows, row) ? 'active' : null}>
  {
	        this.props.columns.map((col, colInd) => {
	          return (
  <td key={col.key}>
  {
	                this.renderCell(col, row, rowInd, colInd, rows)
	              }
	            </td>
	          );
	        })
	      }
	    </tr>
	  ) : null;
	}

	renderCell(colSetting, rowData, rowInd, colInd, rows) {
	  const value = rowData[colSetting.key];
	  let formatFn;
	  if (colSetting.format) {
	    if (typeof colSetting.format === 'string') {
	      formatFn = this.props.viewOptions.helpers.format[colSetting.format];
	    } else {
	      formatFn = colSetting.format;
	    }
	  }
	  if (!formatFn) {
	    formatFn = defaultColSetting.format;
	  }
		const fmtVal = formatFn(value); 
	  if (colSetting.template) {
	    return (
  <div dangerouslySetInnerHTML={{
	        __html: _.template(colSetting.template)({
	          fmtVal: fmtVal,
	          rowData: rowData,
	          rowInd: rowInd,
	          colInd: colInd,
	          rows: rows,
	          format: this.props.viewOptions.helpers.format,
	        }),
	      }}
	      />
	    );
	  } else if (colSetting.render) {
	    return (
	      colSetting.render(fmtVal, rowData, rowInd, colInd, rows, this)
	    );
	  }
	  return <span title={fmtVal}>{fmtVal}</span>;
	}
}
