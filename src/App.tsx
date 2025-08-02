import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Viewer from './pages/Viewer';
import ViewerSafe from './pages/ViewerSafe';
import Draw from './pages/Draw';
import Photo from './pages/Photo';
import Controller from './pages/Controller';

// Test component
import { SystemTest } from './components/UI/SystemTest';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home page with QR codes */}
          <Route path="/" element={<Home />} />
          
          {/* Projector display - fullscreen slideshow with canvas and photos */}
          <Route path="/viewer" element={<Viewer />} />
          
          {/* Safe projector display - original 3 slides only */}
          <Route path="/viewersafe" element={<ViewerSafe />} />
          
          {/* Mobile drawing interface */}
          <Route path="/draw" element={<Draw />} />
          
          {/* Photo capture interface */}
          <Route path="/photo" element={<Photo />} />
          
          {/* Host controller interface */}
          <Route path="/controller" element={<Controller />} />
          
          {/* System test page */}
          <Route path="/test" element={<SystemTest />} />
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;