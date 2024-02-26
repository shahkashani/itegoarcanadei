import { createRoot } from 'react-dom/client';
import { Maurilia } from '../pages/Maurilia';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<Maurilia />);
