import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownAIResponseProps {
  response: string;
}

const MarkdownAIResponse: React.FC<MarkdownAIResponseProps> = ({
  response,
}) => {
  return (
    <div className="p-4   w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold" {...props} />
          ),
          p: ({ node, ...props }) => <p className="text-gray-700" {...props} />,
          code: ({ node, inline, className, children, ...props }) => (
            <pre className="bg-gray-900 text-white p-2 rounded-md overflow-x-auto">
              <code {...props} className={className}>
                {children}
              </code>
            </pre>
          ),
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownAIResponse;
