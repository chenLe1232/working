import React from 'react';
import Button from '$components/kb-design/Button';
import KbInput from '$components/kb-design/Input';

class OrderLogin extends React.Component{

  
  render() {
    return (
      <div className="order-login">
        <Button
          btnType="link"
          href="/"
          className="login"
          target="_blank"
        >
          登录
        </Button>
        <Button
          btnType="link"
          href="/"
          className="signin"
          target="_blank"
        >
          注册
        </Button>
      </div>
    );
  }
}

export default OrderLogin;
