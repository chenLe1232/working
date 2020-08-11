import '../styles/publicComponents/modal.css'
import $ from 'jquery'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import hashChange from '../decorators/hashChange'

const zIndex = 1000

@hashChange((dom, component) => {
  // component.close()
  component.constructor.unMount(component)
  component.unbind()
})
export default class Modal extends Component {
    static defaultProps = {
        modal: true,
        draggable: true,
        resizable: false,
        defaultSize: {
          width: 'auto',
          height: 'auto'
        },
        defaultPosition: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30
        },
        onClose: () => {},
        onResume: () => {},
        onMinimize: () => {}
    }
    static mount(props = {}, parent = document.body){
      // zIndex = zIndex + 1;
      var container = document.createElement('div')
      parent.appendChild(container)
      return ReactDOM.render(<this {...Object.assign({}, Modal.defaultProps, props)} />, container, function (){
        this.__container = container
      });
    }
    static unMount(dialog){
      // zIndex = zIndex - 1;
      if(dialog.__container){
        ReactDOM.unmountComponentAtNode(dialog.__container);
        if(dialog.__container.parentNode){
          dialog.__container.parentNode.removeChild(dialog.__container)
        }
      }
    }
    constructor(props, context){
      super(props, context)
      this.close = this.close.bind(this)
      this.state = {
        minimized: false,
        style: Object.assign({zIndex: zIndex, position: 'absolute'}, this.props.defaultSize, this.props.defaultPosition),
        zIndex: zIndex
      }
      this._startDrag = this._startDrag.bind(this)
      this._dragging = this._dragging.bind(this)
      this._stopDrag = this._stopDrag.bind(this)
    }
    close(...args){
      this.constructor.unMount(this)
      this.props.onClose(...args)
    }
    minimize(){
      this.setState({minimized: true}, () => {
        this.props.onMinimize()
      })
    }
    maximize(){
      this.setState({minimized: false}, () => {
        this.props.onResume()
      });
    }
    _startDrag(e){
      var outOffset = this.$dialog.offsetParent().offset()
          , dialogOffset = this.$dialog.offset()
          , offset = {
        x: outOffset.left + (e.pageX - dialogOffset.left),
        y: outOffset.top + (e.pageY - dialogOffset.top)
      }
      $(document).on('mousemove', null, offset, this._dragging)
      $(document).on('mouseup', this._stopDrag)
    }
    _dragging(e){
      e.stopPropagation()
      e.preventDefault()
      var position = {
        x: e.pageX - e.data.x,
        y: e.pageY - e.data.y
      }
      this.state.style.left = position.x
      this.state.style.top = position.y
      this.$dialog.css({
        left: position.x,
        top: position.y
      })

    }
    _stopDrag(e){
      $(document).off('mousemove', this._dragging)
      $(document).off('mouseup', this._stopDrag)
    }
    componentDidMount(){
      var $dialog = this.$dialog = $(this.refs.dialog)
          , $header = $(this.refs.header)
      if(this.props.draggable){
        $header.on('mousedown', this._startDrag)
      }

    }
    componentWillUnmount(){
      var $dialog = $(this.refs.dialog)
          , $header = $(this.refs.header)
      if(this.props.draggable){
        $header.off('mousedown', this._startDrag)
      }
    }
    renderCtrls(){
      return (
          <div className="close" onClick={() => this.close()}>
          {/*<i className="iconfont" onClick={() => this.minimize()}>&#xe62d;</i>*/}
            <i className="iconfont">&#xe642;</i>
          </div>
      )
    }
    renderHeader(){
      return (
          <h5 className="modal-title">{this.props.title}</h5>
      )
    }
    renderBody(){
      return (
          <div></div>
      )
    }
    renderFooter(){
      return (
          <div></div>
      )
    }
    render(){
      return (
        <div className={cx({'minimized': this.state.minimized})}>
          <div className="modal-content modal-shadow flex-col-1" style={this.state.style} ref="dialog">
            <div className="modal-header" ref="header">
              {this.renderCtrls()}
              {this.renderHeader()}
            </div>
            <div className="modal-body scroll-y flex-col-1 bg-white" ref="body">
              {this.props.children || this.renderBody()}
            </div>
          </div>
          {
            // <div className="modal-minimized">
            //   <div className="minimized-container">
            //     {this.props.title}
            //     <i className="icon" onClick={() => this.maximize()}>&#xe62d;</i>
            //     <i className="icon">&#xe64a;</i>
            //   </div>
            // </div>
          }
          {
            this.props.modal ? (
            <div className="modal-backdrop"></div>
            ) : null
          }
        </div>
      )
    }
}
