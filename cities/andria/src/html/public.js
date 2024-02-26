import { createRoot } from 'react-dom/client';
import { Andria } from '../pages/Andria';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Andria />);
