// @flow

import React from "react"

import {
  Page,
} from "tabler-react";

import BasicLayout from '@layouts/BasicLayout';

class IndexPage extends React.Component {
  render() {
    return (
      <BasicLayout>
        <Page.Content title="Dashboard">
          hahaha
        </Page.Content>
      </BasicLayout>
    );
  }
}

export default IndexPage
