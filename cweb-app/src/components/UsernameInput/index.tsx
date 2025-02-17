import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface Props {
  username: string;
  setUsername: (username: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  fetchData: () => void;
}

const UsernameInput = ({
  username,
  setUsername,
  setIsEditing,
  fetchData,
}: Props) => {
  const [input, setInput] = useState(username);

  const handleSave = () => {
    if (!input.trim()) {
      alert('Please enter a valid username.');
      return;
    }
    localStorage.setItem('username', input);
    setUsername(input);
    setIsEditing(false);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-col w-full max-w-sm items-start gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Enter your username"
          className="border border-muted px-4 py-2 max-w-[25rem]"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => setIsEditing(false)}
          className=""
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-primary text-white hover:bg-black "
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default UsernameInput;
