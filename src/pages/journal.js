import React from 'react';

import {
  Page,
  Grid,
} from 'tabler-react';
import BasicLayout from '@layouts/BasicLayout';
import JournalCard from '@/JournalCard';

class Journal extends React.Component {
  componentDidMount = async () => {
  }

  state = {
    postIds: [
      '1u4mmE8LauRAVO0byRqLuPz9wSOxVrHm0',
      '1lm-HCePU9XbvsEbFJdmigNtpVoWJf7Ey',
      '1ULxbIN09uHi9YZ44bkRJKa50XzJtIB2t',
      '1OUV-Uzb2t0gX4B5mJQT4Y86S-GlxG9Hd',
      '178x30uQgZLTaKArum_vDJusJTDBi4w_O'
    ]
  }

  render() {
    const { postIds } = this.state;

    return (
      <BasicLayout>
        <Page.Content>
          <Page.Header title="Journal">
          </Page.Header>
          <Grid.Row>
            {
              postIds.map((x) => (
                <Grid.Col width={8} offset={2} key={x}>
                  <JournalCard postId={x} />
                </Grid.Col>
              ))
            }
          </Grid.Row>
        </Page.Content>
      </BasicLayout>
    );
  }
}

export default Journal;
