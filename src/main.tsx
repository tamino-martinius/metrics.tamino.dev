import { createRoot } from 'react-dom/client';
import App from '@/components/App';

function Main() {
  return <App />;
}

createRoot(document.getElementById('app')!).render(<Main />);
