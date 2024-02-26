import { createRoot } from 'react-dom/client';
import { Esmeralda } from '../pages/Esmeralda';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Esmeralda />);
