import { useId } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const tooltipId = useId();

  return (
    <span className="tooltip-wrapper" aria-describedby={tooltipId}>
      {children}
      <span id={tooltipId} className="tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
