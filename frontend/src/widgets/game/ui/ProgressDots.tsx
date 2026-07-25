interface Props {
  current: number;
  total: number;
}

export function ProgressDots({ current, total }: Props) {
  return (
    <div className="progress-strip">
      <div className="progress-dots">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`p-dot ${i + 1 < current ? "done" : ""} ${i + 1 === current ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="progress-label">
        {current} из {total}
      </div>
    </div>
  );
}
