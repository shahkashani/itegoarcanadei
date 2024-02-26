import { createRoot } from 'react-dom/client';
import { Hypatia } from '../pages/Hypatia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Hypatia />);
