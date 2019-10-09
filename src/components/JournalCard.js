import React, {Fragment} from 'react';
import ky from 'ky';

import markdownIt from 'markdown-it';
import mk from 'markdown-it-katex';

import {
  Card,
  Tag,
  Icon
} from 'tabler-react';

import MarkdownBlock from '@/MarkdownBlock';

const md = markdownIt();
md.use(mk)

class JournalCard extends React.Component {
  state = {
    postId: '',
    markdown: {
      metadata: {},
      content: ''
    }
  }

  async componentDidMount() {
    const { postId } = this.props;
    const markdown = await ky.get('http://localhost:3000/drive/getPost', {
      searchParams: {
        postId
      }
    })
      .json()
    ;

    if (!markdown.ok)
      return;

    const {
      id, markdown: { metadata, content }
    } = markdown;

    this.setState({
      postId: id,
      markdown: { metadata, content }
    });
  }

  render() {
    const {
      postId,
      markdown: { metadata, content }
    } = this.state;

    const {
      title = '',
      date = '',
    } = metadata || {};

    let { keywords = [] } = metadata || {};
    if (keywords === null)
      keywords = []

    return (
      <Card>
        <Card.Status color="purple" />
        <Card.Header>
          <Card.Title>
            {title}
          </Card.Title>
          <Card.Options>
          </Card.Options>
        </Card.Header>
        <Card.Body>
          <div>
            <Tag.List>
              {
                keywords.map((x) => (
                  <Tag rounded key={x}>{x}</Tag>
                ))
              }
            </Tag.List>
          </div>
          <MarkdownBlock source={content} />
        </Card.Body>
        <Card.Footer>
          <p>
            {date}
          </p>
        </Card.Footer>
      </Card>
    );
  }
}

export default JournalCard;
