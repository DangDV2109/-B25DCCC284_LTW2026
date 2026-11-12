import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({
  questionIndex,
  totalQuestions,
  question,
  status,
  selectedOption,
  onSelectAnswer,
  hintActive,
}) => {
  const levelName = LEVELS[question.level];
  const multiplierText = formatMultiplier(MULTIPLIERS[question.level]);
  const isRevealed = status === 'revealed';

  const getButtonStatusClass = (idx) => {
    if (!isRevealed) return '';
    if (idx === question.answer) return 'answer-correct';
    if (idx === selectedOption && selectedOption !== question.answer) return 'answer-wrong';
    return '';
  };

  return (
    <div className="question-card">
      <h3>
        {`Câu ${questionIndex + 1}/${totalQuestions} · ${question.topic} · ${levelName} (${multiplierText})`}
      </h3>

      <p className="question-text">{question.question}</p>

      {hintActive && <p className="hint-text">{`Gợi ý: ${question.hint}`}</p>}

      <div className="answers-grid">
        {question.options.map((opt, idx) => (
          <AnswerButton
            key={idx}
            index={idx}
            option={opt}
            onSelect={onSelectAnswer}
            disabled={isRevealed}
            statusClass={getButtonStatusClass(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
