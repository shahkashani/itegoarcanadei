import { createRoot } from 'react-dom/client';
import { Isaura } from '../pages/Isaura';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Isaura />);
