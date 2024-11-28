"use client";

import { PlusCircle, Image, Type, Square, Download, Undo, Redo } from 'lucide-react';

const Toolbar = () => {
  return (
    <div className="h-16 bg-white border-b flex items-center px-4 gap-2">
      <button className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
        <PlusCircle className="w-5 h-5" />
        <span>New</span>
      </button>
      <div className="h-6 w-px bg-gray-200 mx-2" />
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Image className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Type className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Square className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-200 mx-2" />
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Undo className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Redo className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <button className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2">
        <Download className="w-5 h-5" />
        <span>Download</span>
      </button>
    </div>
  );
};

export default Toolbar;