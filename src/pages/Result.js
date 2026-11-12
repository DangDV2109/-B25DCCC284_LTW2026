import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatScore } from '../data';
import { getResult } from '../utils';
import ScoreChart from '../components/ScoreChart';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, rounds, finalScore, correctCount, reason } = state;
  const playedCount = rounds.length;
  const evaluation = getResult(finalScore);

  return (
    <div className="page-container">
      <h2>
        {reason === 'bankrupt' ? 'Bạn đã cháy túi!' : 'Bạn đã hoàn thành 12 câu.'}
      </h2>

      <div className="result-summary">
        <p>{`Người chơi: ${name}`}</p>
        <p>{`Số câu trả lời đúng: ${correctCount}/${playedCount}`}</p>
        <p>{`Điểm cuối: ${formatScore(finalScore)}`}</p>
        <p>{`Đánh giá: ${evaluation}`}</p>
      </div>

      <ScoreChart rounds={rounds} />

      <div className="action-buttons">
        <button type="button" className="btn" onClick={() => navigate('/play')}>
          Chơi lại
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;
