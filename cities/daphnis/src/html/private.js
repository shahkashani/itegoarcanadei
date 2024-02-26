import { createRoot } from 'react-dom/client';
import { Daphnis } from '../pages/Daphnis';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Daphnis />);
