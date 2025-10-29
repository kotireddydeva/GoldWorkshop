import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateJob from './pages/CreateJob';
import RawMaterialEntry from './pages/RawMaterialEntry';
import ProductionTracker from './pages/ProductionTracker';
import ItemEntry from './pages/ItemEntry';
import StoneEntry from './pages/StoneEntry';
import Reports from './pages/Reports';
import Summary from './pages/Summary';

import './App.css'

export default function App() {
  return (
    <Router>
      <div className="flex app-root bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<CreateJob />} />
            <Route path="/raw-material" element={<RawMaterialEntry />} />
            <Route path="/production" element={<ProductionTracker />} />
            <Route path="/items" element={<ItemEntry />} />
            <Route path="/stones" element={<StoneEntry />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
