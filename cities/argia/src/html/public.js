import { createRoot } from 'react-dom/client';
import { Argia } from '../pages/Argia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Argia />);
