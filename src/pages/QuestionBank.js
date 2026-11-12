import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MULTIPLIERS, formatMultiplier } from '../data';

const QuestionBank = ({ questions, loading, error, bookmarks, toggleBookmark }) => {
  const [selectedLevels, setSelectedLevels] = useState([1, 2, 3]);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLevelChange = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]
    );
  };

  const handleLookupShift = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-text">Không tải được câu hỏi</p>;
  }

  const filteredQuestions = questions.filter((q) => {
    const matchLevel = selectedLevels.includes(q.level);
    const matchBookmark = !onlyBookmarked || bookmarks.includes(q.id);
    const matchSearch = q.question
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    return matchLevel && matchBookmark && matchSearch;
  });

  return (
    <div className="page-container">
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters-box">
        <div className="filter-group">
          <span>Mức độ: </span>
          {[1, 2, 3].map((lvl) => (
            <label key={lvl} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedLevels.includes(lvl)}
                onChange={() => handleLevelChange(lvl)}
              />
              {LEVELS[lvl]}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyBookmarked}
              onChange={(e) => setOnlyBookmarked(e.target.checked)}
            />
            Chỉ hiện câu đã đánh dấu
          </label>
        </div>

        <div className="filter-group">
          <label>
            Tìm kiếm:{' '}
            <input
              type="text"
              placeholder="Nhập từ khóa câu hỏi..."
              value={searchQuery}
              onChange={handleLookupShift}
            />
          </label>
        </div>
      </div>

      <div className="summary-info">
        <p>{`Có ${filteredQuestions.length} câu hỏi`}</p>
        <p>{`Đã đánh dấu: ${bookmarks.length} câu`}</p>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, index) => {
            const isBookmarked = bookmarks.includes(q.id);
            return (
              <tr key={q.id}>
                <td>{index + 1}</td>
                <td>{q.topic}</td>
                <td>{LEVELS[q.level]}</td>
                <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
                <td>
                  <Link to={`/questions/${q.id}`}>{q.question}</Link>
                </td>
                <td className="center-cell">
                  <button
                    type="button"
                    className="bookmark-btn"
                    onClick={() => toggleBookmark(q.id)}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
