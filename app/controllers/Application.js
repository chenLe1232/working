import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import PageHeader from '$controllers/partials/PageHeader';
import { ThemeProvider } from '$components/ThemeContext';
import themeConfig from '$config/themeConfig';
import Loading from '$publicComponents/Loading';
import RootView from './exchange/RootView';
import Container from '$components/kb-design/Container';
import Notification from '$components/kb-design/Notification';

class Application extends Component {
  constructor(props) {
    super(props);
    this.toggleTheme = () => {
      const theme = this.state.theme === themeConfig.dark ? themeConfig.dark : themeConfig.light;
      this.setState({ theme });
    };
    this.state = {
      theme: themeConfig.dark,
      toggleTheme: this.toggleTheme,
    };
  }

  componentDidMount() {
    const { initStart } = this.props;
    initStart();
  }

  handleNotification() {
    Notification.open({
      children: (<div>666</div>),
      // className: "kb-notification",
      duration: 2000,
    });
  }

  render() {
    const {
      locale,
      messages,
      booting,
    } = this.props;

    return booting
      ? (
        <Loading />
      ) : (
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages[locale]}
        >
          <ThemeProvider value={this.state}>
            <Container flex justify="center" direction="column" className="page-container">
              <PageHeader />
              <RootView />
              {/* <Container style={{ width: '100px', height: '100px', backgroundColor: 'aqua' }} onClick={() => { this.handleNotification() }}>
                Notification
              </Container> */}
            </Container>
          </ThemeProvider>
        </IntlProvider>
      );
  }
}

const mapState = (state) => {
  return {
    booting: state.booting,
    locale: state.locale,
    messages: state.messages,
  };
};

const mapDispatch = (dispatch) => ({
  initStart: () => dispatch.appInit.start(),
  onLocaleChange: (value) => dispatch.locale.onChangeLocale(value),
});

export default connect(mapState, mapDispatch)(Application);
