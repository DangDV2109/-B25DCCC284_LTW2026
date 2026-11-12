import { LETTERS } from '../data';

const AnswerButton = ({ index, option, onSelect, disabled, statusClass }) => {
  return (
    <button
      type="button"
      className={`answer-btn ${statusClass || ''}`.trim()}
      onClick={() => onSelect(index)}
      disabled={disabled}
    >
      {`${LETTERS[index]}. ${option}`}
    </button>
  );
};

export default AnswerButton;
