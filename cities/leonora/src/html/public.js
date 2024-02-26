import { createRoot } from 'react-dom/client';
import { Leonora } from '../pages/Leonora';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Leonora />);
