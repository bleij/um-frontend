import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div>
      <RouterProvider router={router} fallbackElement={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center"><p>Loading...</p></div></div>} />
    </div>
  );
}