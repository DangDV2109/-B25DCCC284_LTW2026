import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const isBlank = !playerName || playerName.trim() === '';

  const handleStart = (e) => {
    e.preventDefault();
    if (!isBlank) {
      navigate('/play');
    }
  };

  return (
    <div className="page-container">
      <h1>Đặt cược kiến thức</h1>

      <div className="rules-box">
        <h3>Luật chơi</h3>
        <ul>
          <li>Bắt đầu với 1.000 điểm và vượt qua 12 câu hỏi về HTML, CSS, JavaScript và React.</li>
          <li>
            Trước mỗi câu, bạn chỉ biết chủ đề, mức độ và hệ số rồi đặt cược từ 100 đến 500 điểm
            (bội số của 100, không vượt quá số điểm hiện có).
          </li>
          <li>Sau khi đặt cược, câu hỏi hiện ra và bạn có 25 giây để trả lời.</li>
          <li>
            Trả lời đúng: cộng mức cược nhân hệ số mức độ (Dễ x1, Trung bình x1,5, Khó x2). Trả lời
            sai hoặc hết giờ: trừ đúng mức cược.
          </li>
          <li>Còn dưới 100 điểm là cháy túi, lượt chơi kết thúc ngay.</li>
        </ul>
      </div>

      <form className="home-form" onSubmit={handleStart}>
        <label htmlFor="player-name-input">Tên người chơi: </label>
        <input
          id="player-name-input"
          type="text"
          placeholder="Nhập tên của bạn..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" className="btn" disabled={isBlank}>
          Vào chơi
        </button>
      </form>
    </div>
  );
};

export default Home;
