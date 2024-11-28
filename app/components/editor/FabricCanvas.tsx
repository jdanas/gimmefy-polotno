"use client";

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const FabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 64, // Accounting for toolbar height
        backgroundColor: '#ffffff'
      });

      // Add some default objects
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '#3B82F6',
        width: 100,
        height: 100
      });

      const text = new fabric.Text('Start designing!', {
        left: 250,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 24
      });

      fabricRef.current.add(rect, text);
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-50">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;