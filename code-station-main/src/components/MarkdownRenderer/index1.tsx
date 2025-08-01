// import ReactMarkdown from 'react-markdown';
// import rehypeColorChips from 'rehype-color-chips';
// // import { remarkGfm } from 'remark-gfm';
// import { Divider } from 'antd';
// import 'highlight.js/styles/default.css';
// import 'juejin-markdown-themes/dist/condensed-night-purple';
// import 'juejin-markdown-themes/dist/condensed-night-purple.min.css';
// import React from 'react';
// import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import remarkGfm from 'remark-gfm';

// const customStyle = {
//   backgroundColor: '#f0f0f0', // 自定义背景颜色
// };

// const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
//   return (
//     <ReactMarkdown
//       remarkPlugins={[remarkGfm]}
//       rehypePlugins={[rehypeColorChips]}
//       // eslint-disable-next-line react/no-children-prop
//       children={markdown}
//       components={{
//         code({
//           inline,
//           className,
//           children,
//           ...props
//         }: SyntaxHighlighterProps) {
//           const match = /language-(\w+)/.exec(className || '');
//           console.log(match, 'match');

//           return !inline && match ? (
//             <div
//               style={{
//                 position: 'relative',
//                 marginBottom: '1em',
//                 backgroundColor: '#f0f0f0',
//               }}
//             >
//               <div
//                 style={{
//                   paddingTop: '5px',
//                   paddingLeft: '20px',
//                   opacity: '0.6',
//                   fontSize: '12px',
//                 }}
//               >
//                 {match[1]}
//               </div>
//               <Divider style={{ margin: '5px 0' }}></Divider>
//               <SyntaxHighlighter
//                 style={coy}
//                 language={match[1]}
//                 PreTag="div"
//                 customStyle={customStyle}
//                 {...props}
//               >
//                 {String(children).replace(/\n$/, '')}
//               </SyntaxHighlighter>
//             </div>
//           ) : (
//             <code className={className} {...props}>
//               {children}
//             </code>
//           );
//         },
//       }}
//     />
//   );
// };

// export default MarkdownRenderer;
