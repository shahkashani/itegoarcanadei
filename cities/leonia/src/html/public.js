import { createRoot } from 'react-dom/client';
import { Leonia } from '../pages/Leonia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Leonia />);
