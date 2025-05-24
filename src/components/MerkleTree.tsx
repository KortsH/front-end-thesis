import { JSX, useLayoutEffect, useRef, useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import HexEnc from 'crypto-js/enc-hex';

interface MerkleTreeProps {
  commitments: string[]; 
}

export default function MerkleTree({ commitments }: MerkleTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<
    Array<{ hash: string; x: number; y: number; depth: number; index: number }>
  >([]);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const HORIZONTAL_PADDING = 20;    // px
  const LAYER_HEIGHT = 120;         // px between layers
  const VERTICAL_PADDING_TOP = 30;  // px from top for root

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();

    let current = commitments.map(c => SHA256(c).toString(HexEnc));
    const layers: string[][] = [current];
    while (current.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const left  = current[i];
        const right = current[i + 1] ?? left;
        next.push(SHA256(left + right).toString(HexEnc));
      }
      layers.push(next);
      current = next;
    }

    const maxDepth = layers.length - 1;
    const totalHeight = VERTICAL_PADDING_TOP + (maxDepth + 1) * LAYER_HEIGHT;

    const allNodes: typeof nodes = [];
    layers.forEach((layer, depth) => {
      const y = VERTICAL_PADDING_TOP + (maxDepth - depth) * LAYER_HEIGHT;

      layer.forEach((hash, idx) => {
        const x = ((idx + 1) / (layer.length + 1)) * width;
        allNodes.push({ hash, x, y, depth, index: idx });
      });
    });
    setNodes(allNodes);
    setSvgSize({ width, height: totalHeight });
  }, [commitments]);

  const lines: JSX.Element[] = [];
  const maxDepth = Math.log2(commitments.length);
  if (nodes.length) {
    nodes.forEach(parent => {
      if (parent.depth >= maxDepth) return;
      const childLayer = nodes.filter(n => n.depth === parent.depth - 1);
      const left  = childLayer.find(c => c.index === parent.index * 2);
      const right = childLayer.find(c => c.index === parent.index * 2 + 1);
      if (left) {
        lines.push(
          <line
            key={`${parent.depth}-${parent.index}-l`}
            x1={parent.x} y1={parent.y}
            x2={left.x}   y2={left.y}
            stroke="rgba(100,100,100,0.5)"
            strokeWidth={1}
          />
        );
      }
      if (right && right !== left) {
        lines.push(
          <line
            key={`${parent.depth}-${parent.index}-r`}
            x1={parent.x} y1={parent.y}
            x2={right.x}  y2={right.y}
            stroke="rgba(100,100,100,0.5)"
            strokeWidth={1}
          />
        );
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{ height: svgSize.height }}
    >
      <svg
        width={svgSize.width}
        height={svgSize.height}
        className="absolute top-0 left-0 pointer-events-none"
      >
        {lines}
      </svg>

      {nodes.map(n => (
        <div
          key={`${n.depth}-${n.index}`}
          className="
            absolute -translate-x-1/2 -translate-y-1/2
            bg-gray-200 dark:bg-gray-700
            border border-gray-400 dark:border-gray-600
            rounded-md px-3 py-1
            font-mono text-[0.65rem] text-gray-800 dark:text-gray-100
            hover:z-20 hover:scale-110 transition-transform
          "
          style={{ left: n.x, top: n.y }}
          title={n.hash}
        >
          {n.hash.slice(0, 8)}…
        </div>
      ))}
    </div>
  );
}