import React, { useRef, useState } from "react";

interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

interface BlockItemProps {
  block: Block;
}

export function BlockItem({ block }: BlockItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealStyle, setRevealStyle] = useState<React.CSSProperties>({
    maxHeight: 0,
    padding: 0,
    top: "100%",
    bottom: "auto",
  });

  const handleMouseEnter = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const desired = rect.height * 3;      // 3× height
    const margin = 8;                     // a little breathing room
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    setRevealStyle({
      top: "100%",
      bottom: "auto",
      maxHeight: `${Math.min(desired, spaceBelow)}px`,
      padding: "0.5rem",
    });
  };

  const handleMouseLeave = () => {
    // collapse back
    setRevealStyle({
      maxHeight: 0,
      padding: 0,
      top: "100%",
      bottom: "auto",
    });
  };

  return (
    <div className="block-wrapper">
      <div
        ref={containerRef}
        className="block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="block-index">#{block.index}</div>
        <div className="block-reveal" style={revealStyle}>
          <pre>{JSON.stringify(block, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
