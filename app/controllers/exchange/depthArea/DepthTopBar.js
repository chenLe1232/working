import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import Container from '$components/kb-design/Container';
import { Tabs, TabPane } from '$components/kb-design/KTabs';
import DepthAskSide from '$components/icons/DepthAskSide';
import DepthBidSide from '$components/icons/DepthBidSide';
import DepthBothSide from '$components/icons/DepthBothSide';

const messages = defineMessages({
  aggregate: {
    id: 'depthTopBar.aggregate',
    defaultMessage: '{value} DEC',
    description: '{value} 位小数',
  },
})

class DepthTopBar extends Component {
  render() {
    return (
      <Container flex justify="space-between" className="depth-topbar">
        <Container>
          <Tabs defaultIndex="0">
            <TabPane tab={<DepthBothSide />}>
              1
            </TabPane>
            <TabPane tab={<DepthAskSide />}>
              2
            </TabPane>
            <TabPane tab={<DepthBidSide />}>
              3
            </TabPane>
          </Tabs>
        </Container>
        <Container>
          位小数
        </Container>
      </Container>
    )
  }
}

export default injectIntl(DepthTopBar);
