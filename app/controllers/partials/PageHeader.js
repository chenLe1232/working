import '$styles/partials/pageHeader.less';
import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import classname from 'classnames';
import Cookies from 'js-cookie';
import Container from '$components/kb-design/Container';
import Link from '$components/kb-design/Link';
import { KangboIcon } from '$components/icons';
import codeIcon from '$static/images/code.png';

const messages = defineMessages({
  exchange: {
    id: 'futures.header.exchange',
    defaultMessage: 'Exchange',
    description: '币币交易',
  },
  margin: {
    id: 'futures.header.margin',
    defaultMessage: 'Margin',
    description: '合约交易',
  },
  otc: {
    id: 'futures.header.otc',
    defaultMessage: 'OTC',
    description: '法币交易',
  },
  activities: {
    id: 'futures.header.activities',
    defaultMessage: 'Activities',
    description: '活动',
  },
  download: {
    id: 'futures.header.download',
    defaultMessage: 'Donwload',
    description: '下载',
  },
  scan: {
    id: 'futures.header.scan',
    defaultMessage: 'Scan Code to Download App',
    description: '扫描二维码下载App',
  },
  tool: {
    id: 'futures.header.tool',
    defaultMessage: 'Tools',
    description: '工具',
  },
  help: {
    id: 'futures.header.help',
    defaultMessage: 'Help Center',
    description: '帮助中心',
  },
  feedback: {
    id: 'futures.header.feedback',
    defaultMessage: 'Feedback',
    description: '问题反馈',
  },
  api: {
    id: 'futures.header.api',
    defaultMessage: 'Api Docs',
    description: 'Api 文档',
  },
  login: {
    id: 'futures.header.login',
    defaultMessage: 'Sign In',
    description: '登录',
  },
  register: {
    id: 'futures.header.register',
    defaultMessage: 'Sign Up',
    description: '注册',
  },
  signout: {
    id: 'futures.header.signout',
    defaultMessage: 'Sign Out',
    description: '退出登录',
  },
  usercenter: {
    id: 'futures.header.usercenter',
    defaultMessage: 'User Center',
    description: '用户中心',
  },
});

class PageHeader extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      showCode: false,
      showTool: false,
      showUser: false,
    };
  }

  openMenu = () => {
    this.setState({
      show: true,
    });
  }

  closeMenu = () => {
    this.setState({
      show: false,
    });
  }

  openCodeMenu = () => {
    this.setState({
      showCode: true,
    });
  }

  closeCodeMenu = () => {
    this.setState({
      showCode: false,
    });
  }

  openToolMenu = () => {
    this.setState({
      showTool: true,
    });
  }

  closeToolMenu = () => {
    this.setState({
      showTool: false,
    });
  }

  openUserMenu = () => {
    this.setState({
      showUser: true,
    });
  }

  closeUserMenu = () => {
    this.setState({
      showUser: false,
    });
  }

  handleChangeLocale(locale) {
    this.props.onLocaleChange(locale);
  }

  handleSignOut() {
    console.log(111);
  }

  switchLanguageText(locale) {
    switch (locale) {
      case 'en':
        return 'English';
      case 'zh-CN':
        return '简体中文';
      case 'zh-HK':
        return '繁体中文';
      case 'ko':
        return '한국어';
    }
  }

  render() {
    const {
      intl,
      locale,
      detail,
    } = this.props;
    const { show, showCode, showTool, showUser } = this.state;
    const lang = locale || 'en';
    const token = Cookies.get('token');
    const user = detail ? detail.get('mobile') : '18170877708';
    return (
      <Container flex justify="space-between" className="page-header-container">
        <Container flex alignItems="center" className="page-left-container">
          <Link href={window.location.origin} target="_self"><KangboIcon /></Link>
          <Container flex style={{ marginLeft: 24 }}>
            <Link href={window.location.origin} target="_self" className="header-link">{intl.formatMessage(messages.margin)}</Link>
            <Link href="#" target="_blank" className="header-link">{intl.formatMessage(messages.exchange)}</Link>
            <Link href="#" target="_blank" className="header-link">{intl.formatMessage(messages.otc)}</Link>
            <Link href="#" target="_blank" className="header-link">{intl.formatMessage(messages.activities)}</Link>
          </Container>
        </Container>
        <Container flex alignItems="center" className="page-right-container">
          <Container
            flex
            justify="center"
            alignItems="center"
            onMouseOver={this.openCodeMenu}
            onMouseOut={this.closeCodeMenu}
            className="code-container"
          >
            <span className="code-text">{intl.formatMessage(messages.download)}</span>
            <Container
              className="code-menu"
              style={{ display: showCode ? 'block' : 'none' }}
            >
              <Container flex alignItems="center" justify="center" direction="column" className="code-menuItem">
                <img src={codeIcon} />
                <span>{intl.formatMessage(messages.scan)}</span>
              </Container>
            </Container>
          </Container>
          <Container
            flex
            justify="center"
            alignItems="center"
            onMouseOver={this.openToolMenu}
            onMouseOut={this.closeToolMenu}
            className="tool-container"
          >
            <span className="tool-text">{intl.formatMessage(messages.tool)}</span>
            <Container
              flex
              alignItems="center"
              direction="column"
              className="tool-menu"
              style={{ display: !showTool && 'none' }}
            >
              <Link className="tool-item" href="#">{intl.formatMessage(messages.help)}</Link>
              <Link className="tool-item" href="#">{intl.formatMessage(messages.feedback)}</Link>
              <Link className="tool-item" href="#">{intl.formatMessage(messages.api)}</Link>
            </Container>
          </Container>
          {
            token
              ? (
                <Container
                  flex
                  justify="center"
                  alignItems="center"
                  onMouseOver={this.openUserMenu}
                  onMouseOut={this.closeUserMenu}
                  className="user-container"
                >
                  <span className="user-text">{user}</span>
                  <Container
                    flex
                    alignItems="center"
                    direction="column"
                    className="user-menu"
                    style={{ display: !showUser && 'none' }}
                  >
                    <Link className="user-item" href="#">{intl.formatMessage(messages.usercenter)}</Link>
                    <Container className="user-item" onClick={() => this.handleSignOut()}>{intl.formatMessage(messages.signout)}</Container>
                  </Container>
                </Container>
              )
              : (
                <React.Fragment>
                  <Link href="#" target="_blank" className="header-link">{intl.formatMessage(messages.login)}</Link>
                  <Link href="#" target="_blank" className="header-linkBtn">{intl.formatMessage(messages.register)}</Link>
                </React.Fragment>
              )
          }
          <Container
            flex
            justify="center"
            alignItems="center"
            onMouseOver={this.openMenu}
            onMouseOut={this.closeMenu}
            className="language-container"
          >
            <span className="language-text">{this.switchLanguageText(lang)}</span>
            <Container
              className="language-menu"
              style={{ display: show ? 'block' : 'none' }}
            >
              <Container
                className={classname('language-menuItem', locale === 'en' && 'active')}
                onClick={() => this.handleChangeLocale('en')}
              >
                English
              </Container>
              <Container
                className={classname('language-menuItem', locale === 'zh-CN' && 'active')}
                onClick={() => this.handleChangeLocale('zh-CN')}
              >
                简体中文
              </Container>
              <Container
                className={classname('language-menuItem', locale === 'zh-HK' && 'active')}
                onClick={() => this.handleChangeLocale('zh-HK')}
              >
                繁体中文
              </Container>
              <Container
                className={classname('language-menuItem', locale === 'ko' && 'active')}
                onClick={() => this.handleChangeLocale('ko')}
              >
                한국어
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
}

const mapState = (state) => ({
  locale: state.locale,
});
const mapDispatch = (dispatch) => ({
  onLocaleChange: (value) => dispatch.locale.onChangeLocale(value),
});

export default connect(mapState, mapDispatch)(injectIntl(PageHeader));
