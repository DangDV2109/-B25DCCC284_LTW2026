const ScoreChart = ({ rounds }) => {
  if (!rounds || rounds.length === 0) return null;

  const maxScore = Math.max(...rounds.map((r) => r.scoreAfter), 1);

  return (
    <div className="chart-section">
      <h3>Biểu đồ điểm</h3>
      <div className="score-chart">
        {rounds.map((r, index) => {
          const barHeight = Math.round((r.scoreAfter / maxScore) * 200);
          return (
            <div key={r.id || index} className="chart-column">
              <span className="chart-score">{r.scoreAfter.toLocaleString('vi-VN')}</span>
              <div
                className={r.correct ? 'chart-bar bar-correct' : 'chart-bar bar-wrong'}
                style={{ height: `${barHeight}px` }}
              />
              <span className="chart-label">{`Câu ${index + 1}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreChart;
