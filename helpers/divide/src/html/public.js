import { createRoot } from 'react-dom/client';
import { TheDivide } from '../pages/TheDivide';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<TheDivide />);
