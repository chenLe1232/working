import React, { Component } from 'react';
import { Pre, Next } from '$components/icons';

class Pagination extends Component {
  static defaultProps = {
    changePage: () => { },
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentPage: 1, // 当前页码
      groupCount: 5, // 页码分组，显示7个页码，其余用省略号显示
      startPage: 1, // 分组开始页码
      totalPage: this.getMaxPages(props.pageConfig.totalPage, props.pageConfig.pageSize), // 总页数
    };
    this.createPage = this.createPage.bind(this);
  }

  createPage() {
    const { currentPage, groupCount, startPage, totalPage } = this.state;
    const pages = [];
    pages.push(
      <li
        className={currentPage === 1 ? 'no-more' : null}
        onClick={() => this.prePageHandeler()}
        key={0}
      >
        <Pre />
      </li>
    );
    if (totalPage <= groupCount) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(
          <li
            key={i}
            onClick={() => this.pageClick(i)}
            className={currentPage === i ? 'active-page' : null}
          >
            {i}
          </li>
        );
      }
    } else {
      pages.push(
        <li
          className={currentPage === 1 ? 'active-page' : null}
          key={1}
          onClick={() => this.pageClick(1)}
        >
          1
        </li>
      );
      if (currentPage >= groupCount) {
        pages.push(<li className="ellipsis-symbol" key={-1}>···</li>);
      }
      let pageLength = 0;
      if (groupCount + startPage > totalPage) {
        pageLength = totalPage;
      } else {
        pageLength = groupCount + startPage;
      }
      for (let i = startPage; i < pageLength; i++) {
        if (i <= totalPage - 1 && i > 1) {
          pages.push(
            <li
              className={currentPage === i ? 'active-page' : null}
              key={i}
              onClick={() => this.pageClick(i)}
            >
              {i}
            </li>
          );
        }
      }
      if (totalPage - startPage >= groupCount + 1) {
        pages.push(<li className="ellipsis-symbol" key={-2}>···</li>);
      }
      pages.push(
        <li
          className={currentPage === totalPage ? 'active-page' : null}
          key={totalPage}
          onClick={() => this.pageClick(totalPage)}
        >
          {totalPage}
        </li>
      );
    }
    pages.push(
      <li
        className={currentPage === totalPage ? 'no-more' : null}
        onClick={() => this.nextPageHandeler()}
        key={totalPage + 1}
      >
        <Next />
      </li>
    );
    return pages;
  }

  pageClick(currentPage) {
    const { groupCount } = this.state;
    if (currentPage >= groupCount) {
      this.setState({
        startPage: currentPage - 2,
      });
    }
    if (currentPage < groupCount) {
      this.setState({
        startPage: 1,
      });
    }
    if (currentPage === 1) {
      this.setState({
        startPage: 1,
      });
    }
    this.setState({
      currentPage,
    });
    this.props.changePage(currentPage);
  }

  prePageHandeler() {
    let { currentPage } = this.state;
    if (--currentPage === 0) {
      return false;
    }
    this.pageClick(currentPage);
  }

  nextPageHandeler() {
    let { currentPage, totalPage } = this.state;
    if (++currentPage > totalPage) {
      return false;
    }
    this.pageClick(currentPage);
  }

  getMaxPages(total, pageSize) {
    if (total === 0) {
      return 1;
    }
    if (total % pageSize === 0) {
      return parseInt(total / pageSize);
    } else {
      return parseInt(total / pageSize) + 1;
    }
  }

  render() {
    return (
      <ul className="pagination-container">
        {this.createPage()}
      </ul>
    );
  }
}

export default Pagination;
