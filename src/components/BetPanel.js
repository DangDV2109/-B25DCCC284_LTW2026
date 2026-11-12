import { LEVELS, MULTIPLIERS, formatScore, formatMultiplier } from '../data';
import { validateBet } from '../utils';

const BetPanel = ({
  questionIndex,
  totalQuestions,
  question,
  score,
  bet,
  setBet,
  onConfirmBet,
  previewActive,
}) => {
  const levelName = LEVELS[question.level];
  const multiplierText = formatMultiplier(MULTIPLIERS[question.level]);
  const errorMsg = validateBet(bet, score);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errorMsg) {
      onConfirmBet();
    }
  };

  return (
    <div className="bet-panel">
      <h3>
        {`Câu ${questionIndex + 1}/${totalQuestions} · ${question.topic} · ${levelName} (${multiplierText})`}
      </h3>

      <p>{`Điểm hiện có: ${formatScore(score)}`}</p>

      {previewActive && (
        <div className="preview-box">
          <p className="question-text">{question.question}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bet-form">
        <label htmlFor="bet-input">Mức cược: </label>
        <input
          id="bet-input"
          type="number"
          step="100"
          value={bet}
          onChange={(e) => setBet(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <button type="submit" className="btn" disabled={Boolean(errorMsg)}>
          Đặt cược
        </button>
      </form>

      {errorMsg && <p className="error-text">{errorMsg}</p>}
    </div>
  );
};

export default BetPanel;
