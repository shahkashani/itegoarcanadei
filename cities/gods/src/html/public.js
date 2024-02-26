import { createRoot } from 'react-dom/client';
import { HallOfTheGods } from '../pages/HallOfTheGods';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<HallOfTheGods />);
