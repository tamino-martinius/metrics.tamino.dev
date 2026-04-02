import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/components/App';

function Main() {
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      setAlpha((e.alpha || 0) / 90);
      setBeta(((e.beta || 90) - 90) / 90);
      setGamma((e.gamma || 0) / 90);
    }

    window.addEventListener('deviceorientation', handleOrientation);
    return () =>
      window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <App
      style={
        {
          '--alpha': alpha,
          '--beta': beta,
          '--gamma': gamma,
        } as React.CSSProperties
      }
    />
  );
}

createRoot(document.getElementById('app')!).render(<Main />);
