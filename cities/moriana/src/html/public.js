import { createRoot } from 'react-dom/client';
import { Moriana } from '../pages/Moriana';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Moriana />);
