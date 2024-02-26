import { createRoot } from 'react-dom/client';
import { LoginPage } from '../pages/LoginPage';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<LoginPage />);
