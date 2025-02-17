import React, { useState, useEffect, useRef } from 'react';
import { OpenAI } from 'openai';
import MarkdownAIResponse from '../MarkdownAIResponse';

interface AIResponseProps {
  assistantId: string;
  apiKey: string;
  data: string;
}

const AIResponse: React.FC<AIResponseProps> = ({
  assistantId,
  apiKey,
  data,
}) => {
  const uniqueKey = `ai_response_${assistantId}_${btoa(data)}`;
  const cachedResponse = localStorage.getItem(uniqueKey);

  const [response, setResponse] = useState<string>(cachedResponse || '');
  const [loading, setLoading] = useState<boolean>(!cachedResponse);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const fetchResponse = async () => {
    if (cachedResponse) return; // Stop API call if response is already in local storage

    setLoading(true);
    try {
      const thread = await openai.beta.threads.create();
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `Additional Data: ${JSON.stringify(data)}`,
      });
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      let completed = false;
      while (!completed) {
        const runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        if (runStatus.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(thread.id);
          const aiResponse =
            messages.data[0]?.content[0]?.text?.value || 'No response';
          setResponse(aiResponse);
          localStorage.setItem(uniqueKey, aiResponse);
          completed = true;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setResponse('Error fetching response');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!cachedResponse) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fetchResponse();
          }
        },
        { threshold: 0.5 }
      );

      if (componentRef.current) {
        observer.observe(componentRef.current);
      }

      return () => {
        if (componentRef.current) {
          observer.unobserve(componentRef.current);
        }
      };
    }
  }, [cachedResponse]); // Only observe if no cached response

  return (
    <div ref={componentRef} className="p-4 border rounded-lg shadow-md w-full">
      {loading ? <p>Loading...</p> : <MarkdownAIResponse response={response} />}
    </div>
  );
};

export default AIResponse;
