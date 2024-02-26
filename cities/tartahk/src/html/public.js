import { createRoot } from 'react-dom/client';
import { Tartahk } from '../pages/Tartahk';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Tartahk />);
