import '../styles/publicComponents/dropdown.css'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import clickOutside from '../decorators/clickOutside'

/**
* 如果不是type = null，只是以简单的方式提供下拉功能。
* 如果type = 'menulist'，会以下拉列表的形式展示，
* 如果没有onChange就是走的hash,否则就是自己维护一个状态，实现内容的切换。
* arrow true显示箭头 默认  false显示列表icon
*/

@clickOutside((component) => {
  component.setState({isActive: false})
})
export default class Dropdown extends Component {
  static defaultProps = {
    className: '',
    type: null,
    arrow:true,
    data: {
      list: [],
      item: {},
      key: null,
      value: null
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
  }
  toggle(){
    this.setState({isActive: !this.state.isActive});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.autoHide){
      this.setState({isActive: false})
    }
  }
  renderMenus(){
    return (
      <ul className="list" style={{maxHeight: 600, overflowY: 'auto'}}>
        {this.props.data.list.map((row) => {
          return this.props.onChange ? (
            <li className="item" key={Math.random()}>
              <a href={'javascript:;'} onClick={() => {
                  this.props.onChange(row);

                  this.setState({
                      isActive: false
                  });
              }}>
                {row[this.props.data.value]}
              </a>
            </li>
          ) : (
            <li className="item" key={Math.random()}>
              <Link to={row.path}>
                {row[this.props.data.value]}
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }
  render(){
    return (
      <div className={cx(this.props.className, {'dropdown': true, 'active': this.state.isActive})}>
        <a href="javascript:;" className="btn dropdown-toggle" onClick={this.toggle.bind(this)}>
          {
            !this.props.type ? this.props.label : this.props.data.item[this.props.data.value]
          }
          {
            this.props.arrow?(<i className='iconfont icon-arrow'>&#xe676;</i>):(<i className='iconfont icon-arrow'>&#xe630;</i>)
          }
        </a>
        {
          this.state.isActive ? (
            <div className="dropdown-main">
              <span className="arrow"></span>
              {
                !this.props.type ? this.props.children : this.renderMenus()
              }
            </div>
          ) : null
        }
      </div>
    )
  }
}
