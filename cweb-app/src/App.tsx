import { useEffect, useState, useCallback } from 'react';
import './App.css';
import MonitorCard from './components/MonitorCard';
import UsernameInput from './components/UsernameInput';
import UsernameDisplay from './components/UsernameDisplay';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';

interface CopiedContent {
  id: number;
  data: string;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<CopiedContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [responseEnabled, setResponseEnabled] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') || ''
  );
  const [isEditing, setIsEditing] = useState<boolean>(!username);

  const fetchData = useCallback(() => {
    if (!username) return;

    fetch(`http://localhost:9001/api/all-copies?username=${username}`)
      .then((response) =>
        response.ok ? response.json() : Promise.reject('Network error')
      )
      .then((data) => setData(data.data))
      .catch((error) => setError(error));
  }, [username, setData, setError]);

  useEffect(() => {
    if (username) {
      const intervalId = setInterval(fetchData, 2000);
      return () => clearInterval(intervalId);
    }
  }, [username, fetchData]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-secondary text-primary p-0 md:p-8">
      <Card className="w-full max-w-screen bg-white h-screen md:h-auto shadow-none md:shadow-md border-0 md:border">
        <CardHeader>
          <CardTitle className="text-2xl font-black">InterviewSync</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <UsernameInput
              username={username}
              setUsername={setUsername}
              setIsEditing={setIsEditing}
              fetchData={fetchData}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <UsernameDisplay
                username={username}
                onEdit={() => setIsEditing(true)}
              />
              <div className="flex items-center justify-end space-x-2">
                <Switch
                  checked={responseEnabled}
                  onCheckedChange={() => setResponseEnabled((prev) => !prev)}
                  id="responseEnabled"
                />
                <Label htmlFor="responseEnabled">AI Response</Label>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>Error: {error}</AlertDescription>
            </Alert>
          )}

          <ul className="mt-4 space-y-4">
            {data.length > 0 ? (
              data.map((item) => (
                <MonitorCard
                  key={item.id}
                  data={item.data}
                  timestamp={item.timestamp}
                  responseEnabled={responseEnabled}
                />
              ))
            ) : (
              <p className="text-gray-400">No data available.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
