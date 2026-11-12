import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';
import { validateBet, calcChange } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';

const Play = ({ questions, loading, error, playerName }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(MIN_BET);
  const [status, setStatus] = useState('betting');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastRoundResult, setLastRoundResult] = useState(null);
  const [rounds, setRounds] = useState([]);

  const isBlankName = !playerName || playerName.trim() === '';
  const currentQuestion = questions[currentIndex];

  const handleConfirmBet = useCallback(() => {
    if (status !== 'betting') return;
    const err = validateBet(bet, score);
    if (err) return;
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedOption(null);
    setLastRoundResult(null);
    setStatus('answering');
  }, [status, bet, score]);

  const finishQuestion = useCallback(
    (chosenIndex) => {
      if (!currentQuestion || status !== 'answering') return;

      const isCorrect = chosenIndex === currentQuestion.answer;
      const actualChange = calcChange(bet, currentQuestion.level, isCorrect);
      const nextScore = score + actualChange;

      const roundRecord = {
        id: currentQuestion.id,
        bet: Number(bet),
        correct: isCorrect,
        change: actualChange,
        scoreAfter: nextScore,
      };

      setSelectedOption(chosenIndex);
      setScore(nextScore);
      setRounds((prev) => [...prev, roundRecord]);
      setLastRoundResult({
        correct: isCorrect,
        change: actualChange,
      });
      setStatus('revealed');
    },
    [currentQuestion, status, bet, score]
  );

  // Đồng hồ 25 giây ở bước trả lời
  useEffect(() => {
    if (status !== 'answering') return undefined;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          finishQuestion(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [status, currentIndex, finishQuestion]);

  // Bước chờ 2 giây sau khi lộ đáp án
  useEffect(() => {
    if (status !== 'revealed') return undefined;

    const timeoutId = setTimeout(() => {
      const isBankrupt = score < MIN_BET;
      const isFinishedAll = currentIndex + 1 >= questions.length;

      if (isBankrupt || isFinishedAll) {
        const correctCount = rounds.filter((r) => r.correct).length;
        const reason = isBankrupt ? 'bankrupt' : 'completed';
        navigate('/result', {
          replace: true,
          state: {
            name: playerName.trim(),
            rounds,
            finalScore: score,
            correctCount,
            reason,
          },
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
        setBet(MIN_BET);
        setSelectedOption(null);
        setLastRoundResult(null);
        setStatus('betting');
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [status, score, currentIndex, questions.length, rounds, playerName, navigate]);

  if (isBlankName) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p className="error-text">Không tải được câu hỏi</p>;
  }

  if (!currentQuestion) {
    return null;
  }

  const renderFeedback = () => {
    if (status !== 'revealed' || !lastRoundResult) return null;
    if (lastRoundResult.correct) {
      return (
        <p className="feedback-text feedback-correct">
          {`+${formatScore(lastRoundResult.change)}`}
        </p>
      );
    }
    const absChange = Math.abs(lastRoundResult.change);
    return (
      <p className="feedback-text feedback-wrong">
        {`−${formatScore(absChange)}`}
      </p>
    );
  };

  return (
    <div className="page-container">
      {status === 'betting' ? (
        <BetPanel
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          question={currentQuestion}
          score={score}
          bet={bet}
          setBet={setBet}
          onConfirmBet={handleConfirmBet}
        />
      ) : (
        <div className="answering-section">
          <div className="play-status-bar">
            <Timer timeLeft={timeLeft} />
            <ScoreInfo score={score} bet={bet} />
          </div>

          <QuestionCard
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            question={currentQuestion}
            status={status}
            selectedOption={selectedOption}
            onSelectAnswer={(idx) => finishQuestion(idx)}
          />

          {renderFeedback()}
        </div>
      )}
    </div>
  );
};

export default Play;
