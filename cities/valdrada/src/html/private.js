import { createRoot } from 'react-dom/client';
import { Cities } from '../pages/Cities';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Cities />);
