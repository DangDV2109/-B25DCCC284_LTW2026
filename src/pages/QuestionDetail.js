import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from '../data';

const QuestionDetail = ({ questions, loading, error, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-text">Không tải được câu hỏi</p>;
  }

  const questionId = Number(id);
  const questionItem = questions.find((q) => q.id === questionId);

  if (!questionItem) {
    return (
      <div className="page-container">
        <p className="error-text">Không tìm thấy câu hỏi</p>
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(questionItem.id);
  const levelName = LEVELS[questionItem.level];
  const multiplierText = formatMultiplier(MULTIPLIERS[questionItem.level]);

  return (
    <div className="page-container">
      <h2>
        {`Câu hỏi số ${questionItem.id} – ${questionItem.topic} · ${levelName} (${multiplierText})`}
      </h2>

      <p className="question-text">{questionItem.question}</p>

      <ul className="options-list">
        {questionItem.options.map((option, idx) => {
          const isCorrect = idx === questionItem.answer;
          return (
            <li
              key={LETTERS[idx]}
              className={isCorrect ? 'option-item correct-option' : 'option-item'}
            >
              {`${LETTERS[idx]}. ${option}${isCorrect ? ' (Đáp án đúng)' : ''}`}
            </li>
          );
        })}
      </ul>

      <p className="hint-text">{`Gợi ý: ${questionItem.hint}`}</p>

      <div className="action-buttons">
        <button
          type="button"
          className="btn"
          onClick={() => toggleBookmark(questionItem.id)}
        >
          {isBookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
