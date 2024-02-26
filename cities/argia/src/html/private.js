import { createRoot } from 'react-dom/client';
import { BackRoom } from '../pages/BackRoom';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<BackRoom />);
