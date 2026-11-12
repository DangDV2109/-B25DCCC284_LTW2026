const Timer = ({ timeLeft }) => {
  const isLow = timeLeft <= 5;
  return (
    <p
      className="timer-text"
      style={{ color: isLow ? '#d32f2f' : undefined, fontWeight: 'bold' }}
    >
      {`Còn ${timeLeft} giây`}
    </p>
  );
};

export default Timer;
