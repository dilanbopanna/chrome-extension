import { formatTimestamp } from '../../utils';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import { Separator } from '../ui/separator';
import AIResponse from '../AIResponse';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const MonitorCard = ({
  data,
  timestamp,
  responseEnabled,
}: {
  data: string;
  timestamp: string;
  responseEnabled: boolean;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch((err) => {
        alert('Failed to copy content: ' + err);
      });
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg my-2 w-full md:w-4/5 h-auto p-8 overflow-scroll">
      <div className="right-ctn flex flex-col md:flex-row w-full justify-between items-center gap-2">
        <div className="timestamp">{formatTimestamp(timestamp)}</div>
        <Button onClick={copyToClipboard} variant="outline" size="icon">
          <Copy />
        </Button>
      </div>
      <pre className="text-sm overflow-auto max-h-32">{data}</pre>
      {responseEnabled && (
        <>
          <Separator className="my-4" />
          <h2 className="font-bold text-md flex justify-start">AI Response</h2>
          <AIResponse
            assistantId="asst_aREFtfUtBX8xLevxXGyJiQGL"
            apiKey={apiKey}
            data={data}
          />
        </>
      )}
    </div>
  );
};

export default MonitorCard;
