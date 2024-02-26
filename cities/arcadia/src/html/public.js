import { createRoot } from 'react-dom/client';
import { Arcadia } from '../pages/Arcadia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Arcadia />);
