import React, { Component, useState, useEffect, createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const instanceRef = [];
const instances = [];
// let key = 0;
let Node;

// const NotifyList = (instances) => (
//   <div>
//     {instances.map((args, index) => <Notification args={{ key: index, ...args }} />)}
//   </div>
// )

class NotifyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: [],
    };
  }

  add(notice) {
    console.log(notice);
    // this.setState({

    // })
  }

  render() {
    const {
      instances,
    } = this.props;
    return (
      <div>
        {instances.map((args, index) => <Notification args={{ key: index, ...args }} />)}
      </div>
    );
  }
}

const Notification = (props) => {
  const {
    children,
    key,
    className: propsClass,
  } = props.args;
  // Notification类名
  const className = classNames(
    'kb-notification',
    propsClass
  );
  const ref = useRef(null); // 获取此项ref
  instanceRef.push(ref);
  useEffect(() => { // 定义出现动画
    ref.current.className = classNames(className, 'open');
  });
  return (
    <div ref={ref} className={className} key={key} style={{ marginTop: `${key * 170 + 50}px` }}>
      Notification+++++++++++++++
      {key}
      {children}
    </div>
  );
};

const NotificationAction = {
  open: (args) => {
    // const { duration = 3000 } = args;
    instances.push(args);
    // ReactDOM.render(<NotifyList instances={instances} />, Node);
    // // console.log(args)
    // // 定时退出
    // setTimeout(() => {
    //   NotificationAction.close();
    // }, duration);
    if (!Node) {
      Node = document.createElement('div');
      document.body.appendChild(Node);
      ReactDOM.render(<NotifyList instances={instances} />, Node);
    }
    const instance = new NotifyList();
    instance.add(1);
  },
  close: () => {
    if (instances.length) {
      // instances[0].className = 'close';
      const { className } = instanceRef[0].current;
      instanceRef[0].current.className = classNames(className, 'close');
      console.log(classNames(className, 'close'));
      setTimeout(() => {
        // instances.shift();
        // instanceRef.shift();
        ReactDOM.render(<NotifyList instances={instances} />, Node);
      }, 1000);
      ReactDOM.render(<NotifyList instances={instances} />, Node);
    }
  },
};

export default NotificationAction;
