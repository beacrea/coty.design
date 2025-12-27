import ReactMarkdown from 'react-markdown';

interface FormattedMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function FormattedMessage({ content, isStreaming }: FormattedMessageProps) {
  return (
    <div className="text-base leading-normal prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0 prose-headings:mt-2 prose-headings:mb-1.5 prose-headings:first:mt-0">
      <ReactMarkdown>{content}</ReactMarkdown>
      {isStreaming && (
        <span 
          className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" 
          aria-label="Loading response"
        />
      )}
    </div>
  );
}
