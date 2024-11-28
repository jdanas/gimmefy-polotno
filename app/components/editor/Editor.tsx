"use client";

import FabricCanvas from './FabricCanvas';
import Toolbar from './Toolbar';

const Editor = () => {
  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1">
        <FabricCanvas />
      </div>
    </div>
  );
};

export default Editor;