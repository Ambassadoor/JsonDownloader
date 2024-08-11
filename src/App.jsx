import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SubscribedCoursesProvider } from './SubscribedCoursesContext';
import AppRouter from './AppRouter';
import './styles/styles.css';

const App = () => (
  <SubscribedCoursesProvider>
    <Router>
      <AppRouter />
    </Router>
  </SubscribedCoursesProvider>
);

export default App;
