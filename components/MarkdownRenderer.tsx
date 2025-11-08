'use client';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose prose-sm sm:prose lg:prose-lg max-w-none">
      <style jsx global>{`
        /* Enhanced markdown code block scrolling */
        .markdown-code-block {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .markdown-code-block::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .markdown-code-block::-webkit-scrollbar-track {
          background: transparent;
        }

        .markdown-code-block::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }

        .markdown-code-block::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }

        /* Scroll fade indicators for markdown code blocks */
        .markdown-scroll-fade-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(to left, rgba(17, 24, 39, 0.8), transparent);
          pointer-events: none;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .markdown-scroll-fade-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, rgba(17, 24, 39, 0.8), transparent);
          pointer-events: none;
          border-radius: 0 0 0.5rem 0.5rem;
        }
      `}</style>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className={`${className} text-xs sm:text-sm`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <div className="relative my-4">
              <pre className="markdown-code-block bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto overflow-y-auto max-h-96">
                {children}
              </pre>
              <div className="markdown-scroll-fade-right"></div>
              <div className="markdown-scroll-fade-bottom"></div>
            </div>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-text-primary mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-text-primary mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-text-primary mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-text-primary mb-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-text-primary">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary my-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent hover:text-primary-dark underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
