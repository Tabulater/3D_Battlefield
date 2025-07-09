import React, { useRef } from 'react';
import { Battlefield3D } from './components/Battlefield3D';

function App() {
  const gameRef = useRef<any>(null);

  return (
    <div className="scene-container">
      <h1 className="title">ELITE MILITARY BASE</h1>
      
      <div className="controls">
        <span className="drag">🖱️ DRAG: Rotate View</span>
        <span className="zoom">🔍 SCROLL: Zoom In/Out</span>
      </div>

      <Battlefield3D ref={gameRef} />
    </div>
  );
}

export default App;