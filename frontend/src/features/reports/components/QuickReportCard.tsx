import React from 'react';

interface QuickReportCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export const QuickReportCard: React.FC<QuickReportCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all duration-200 cursor-pointer flex items-start gap-3 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="p-2 bg-primary-fixed text-primary rounded-lg shrink-0">
        <span className="material-symbols-outlined text-[20px] font-bold">{icon}</span>
      </div>
      <div className="overflow-hidden">
        <h4 className="font-label-md text-label-md text-on-surface font-bold leading-tight truncate">
          {title}
        </h4>
        <p className="text-[11px] text-on-surface-variant leading-tight mt-1 truncate-2-lines">
          {description}
        </p>
      </div>
    </div>
  );
};
