import { createRoot } from 'react-dom/client';
import { Trithemius } from '../pages/Trithemius';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Trithemius />);
