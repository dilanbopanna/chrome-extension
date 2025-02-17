import { Button } from '../components/ui/button';
import { Edit } from 'lucide-react';

interface Props {
  username: string;
  onEdit: () => void;
}

const UsernameDisplay = ({ username, onEdit }: Props) => {
  return (
    <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
      <p className="text-lg">
        Welcome, <span className="font-semibold">{username}</span>!
      </p>
      <Button onClick={onEdit} variant="outline">
        <Edit /> Edit
      </Button>
    </div>
  );
};

export default UsernameDisplay;
