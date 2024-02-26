import { createRoot } from 'react-dom/client';
import { TheDepths } from '../pages/TheDepths';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<TheDepths />);
