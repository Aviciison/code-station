// import ReactMarkdown from 'react-markdown';
// import rehypeColorChips from 'rehype-color-chips';
// // import { remarkGfm } from 'remark-gfm';
// import { Divider } from 'antd';
// import 'highlight.js/styles/default.css';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { BytemdPlugin } from 'bytemd';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';
import 'juejin-markdown-themes/dist/condensed-night-purple';
import 'juejin-markdown-themes/dist/condensed-night-purple.min.css';
// import React from 'react';
// import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import remarkGfm from 'remark-gfm';

// const customStyle = {
//   backgroundColor: '#f0f0f0', // 自定义背景颜色
// };

import { Viewer } from '@bytemd/react';

const plugins: BytemdPlugin[] = [gfm(), highlight(), gemoji()];

const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
  return <Viewer plugins={plugins} value={markdown}></Viewer>;
};

export default MarkdownRenderer;
