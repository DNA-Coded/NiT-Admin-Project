import React from 'react';

export const LiveIndicator: React.FC = () => {
  return (
    <span className="flex items-center gap-1 text-success font-label-sm text-label-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
      </span>
      Live
    </span>
  );
};
