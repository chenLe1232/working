import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import Input from '$components/kb-design/Input';
import Container from '$components/kb-design/Container';
import Button from '$components/kb-design/Button';

const messages = defineMessages({
  limits: {
    id: 'exchange.table.input.limits',
    defaultMessage: 'Limits',
    description: '限价',
  },
  markets: {
    id: 'exchange.table.input.markets',
    defaultMessage: 'Markets',
    description: '市价',
  },
})

class TableInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }
  handleInputChange(value) {
    this.setState({
      value
    })
  }
  handleInput(type) {
    if(!this.state.value) return;
    if(type==='limit') {
      console.log(this.state.value)
    } else {
      console.log('market', this.state.value)
    }
    this.setState({
      value: ''
    })
  }
  render() {
    const { intl } = this.props;
    return (
      <Container flex justify = "flex-end">
        <Input style={{width: 100, height: 26}} value={this.state.value} onChange={(e)=>this.handleInputChange(e.target.value)}/>
        <Button onClick={() => this.handleInput('limit')} children={intl.formatMessage(messages.limits)} size="small" style={{marginLeft: 0, height: '28px', fontSize: 12, border: 'none', borderRadius: 0, background: 'linear-gradient(270deg,rgba(251,217,58,1) 0%,rgba(240,185,10,1) 100%)', color: '#212733'}} />
        <Button onClick={() => this.handleInput('market')} children={intl.formatMessage(messages.markets)} size="small" style={{height: '28px', fontSize: 12, border: 'none', borderRadius: 0, background: '#E0284A'}} />
      </Container>
    )
  }
}

export default injectIntl(TableInput)