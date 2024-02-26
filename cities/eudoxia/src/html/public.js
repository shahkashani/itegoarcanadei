import { createRoot } from 'react-dom/client';
import { Eudoxia } from '../pages/Eudoxia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Eudoxia />);
