import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';

function MarkdownBlock(props) {
    const newProps = {
        ...props,
        plugins: [
          RemarkMathPlugin,
        ],
        renderers: {
          ...props.renderers,
          math: (props) =>
            <BlockMath formula={props.value} />,
          inlineMath: (props) =>
            <InlineMath inline formula={props.value} />
        }
      };
      return (
        <ReactMarkdown {...newProps} />
      );
}

export default MarkdownBlock;
