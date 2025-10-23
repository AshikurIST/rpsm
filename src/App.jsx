import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './routes';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import { seedData } from './lib/fakeSeed';

function App() {
  const { initialize: initializeAuth } = useAuthStore();
  const { initialize: initializeData } = useDataStore();

  useEffect(() => {
    // Initialize stores from localStorage
    initializeAuth();
    initializeData();
    
    // Seed initial data if none exists
    seedData();
  }, [initializeAuth, initializeData]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </div>
  );
}

export default App;
