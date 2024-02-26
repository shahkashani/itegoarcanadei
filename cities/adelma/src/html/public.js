import { createRoot } from 'react-dom/client';
import { Adelma } from '../pages/Adelma';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Adelma />);
