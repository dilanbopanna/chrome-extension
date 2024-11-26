import { useEffect, useState } from 'react';
import './App.css';

interface CopiedContent {
  id: number;
  data: string;
  timestamp: string;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  // Format the date as "YYYY-MM-DD HH:MM:SS"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const Card = ({ data, timestamp }: { data: string; timestamp: string }) => {
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
    <div className="card">
      <div className="right-ctn">
        <div className="timestamp">{formatTimestamp(timestamp)}</div>
        <button onClick={copyToClipboard}>Copy</button>
      </div>
      <pre>{data}</pre>
    </div>
  );
};

function App() {
  const [data, setData] = useState<CopiedContent[]>([]); // State to store the fetched data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Fetch data function
  const fetchData = () => {
    setLoading(true);
    fetch('http://localhost:9000/api/all-copies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data.data); // Assuming the response contains a `data` field with the copied content
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        setError(error.message); // Set error message if something goes wrong
        setLoading(false); // Set loading to false even if there's an error
      });
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Poll the API every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading message while waiting for the API response
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if the API call fails
  }

  return (
    <div className="App">
      <h1>Content</h1>
      <ul>
        {data.length > 0 ? (
          data.map((item) => (
            <Card key={item.id} data={item.data} timestamp={item.timestamp} />
          ))
        ) : (
          <p>No data available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
