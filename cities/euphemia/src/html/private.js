import { createRoot } from 'react-dom/client';
import { Euphemia } from '../pages/Euphemia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Euphemia />);
