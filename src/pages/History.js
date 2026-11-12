import { useState } from 'react';
import { formatScore } from '../data';

const History = ({ history, clearHistory }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('ALL');

  if (!history || history.length === 0) {
    return (
      <div className="page-container">
        <h2>Lịch sử lượt chơi</h2>
        <p>Chưa có lượt chơi nào.</p>
      </div>
    );
  }

  const uniquePlayers = [...new Set(history.map((item) => item.name))];

  const filteredHistory =
    selectedPlayer === 'ALL'
      ? history
      : history.filter((item) => item.name === selectedPlayer);

  const sortedHistory = [...filteredHistory].sort((a, b) => b.finalScore - a.finalScore);

  const totalPlayed = sortedHistory.length;
  const highestScore = sortedHistory.reduce(
    (max, item) => (item.finalScore > max ? item.finalScore : max),
    0
  );
  const bankruptCount = sortedHistory.filter((item) => item.result === 'Cháy túi').length;

  return (
    <div className="page-container">
      <h2>Lịch sử lượt chơi</h2>

      <div className="filters-box">
        <label htmlFor="player-select">Người chơi: </label>
        <select
          id="player-select"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          {uniquePlayers.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            clearHistory();
            setSelectedPlayer('ALL');
          }}
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="summary-info">
        <p>{`Số lượt chơi: ${totalPlayed}`}</p>
        <p>{`Điểm cao nhất: ${formatScore(highestScore)}`}</p>
        <p>{`Số lần cháy túi: ${bankruptCount}`}</p>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{`${item.correctCount}/${item.played}`}</td>
              <td>{formatScore(item.finalScore)}</td>
              <td>{item.result}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
