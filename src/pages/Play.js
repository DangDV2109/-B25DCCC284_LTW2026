import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  formatScore,
} from '../data';
import { validateBet, calcChange, getResult } from '../utils';
import BetPanel from '../components/BetPanel';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ScoreInfo from '../components/ScoreInfo';
import Supports from '../components/Supports';

const Play = ({ questions, loading, error, playerName, addHistoryRecord }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(MIN_BET);
  const [status, setStatus] = useState('betting');
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastRoundResult, setLastRoundResult] = useState(null);
  const [rounds, setRounds] = useState([]);

  const [usedSupports, setUsedSupports] = useState({
    preview: false,
    insurance: false,
    hint: false,
  });
  const [previewActive, setPreviewActive] = useState(false);
  const [insuredCurrent, setInsuredCurrent] = useState(false);
  const [hintActive, setHintActive] = useState(false);

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
      const rawChange = calcChange(bet, currentQuestion.level, isCorrect);
      const insuredSaved = !isCorrect && insuredCurrent;
      const actualChange = insuredSaved ? 0 : rawChange;
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
        insuredSaved,
      });
      setStatus('revealed');
    },
    [currentQuestion, status, bet, insuredCurrent, score]
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
        const historyEntry = {
          id: Date.now(),
          name: playerName.trim(),
          finalScore: score,
          correctCount,
          played: rounds.length,
          result: getResult(score),
          playedAt: new Date().toLocaleString('vi-VN'),
        };
        addHistoryRecord(historyEntry);
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
        setPreviewActive(false);
        setInsuredCurrent(false);
        setHintActive(false);
        setSelectedOption(null);
        setLastRoundResult(null);
        setStatus('betting');
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [
    status,
    score,
    currentIndex,
    questions.length,
    rounds,
    playerName,
    addHistoryRecord,
    navigate,
  ]);

  // Phím tắt ở bước đặt cược
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'betting') return;

      const maxAllowed = Math.floor(Math.min(MAX_BET, score) / BET_STEP) * BET_STEP;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBet((prev) => {
          const current = Number(prev) || MIN_BET;
          const next = Math.min(maxAllowed, current + BET_STEP);
          return Math.max(MIN_BET, next);
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBet((prev) => {
          const current = Number(prev) || MIN_BET;
          const next = Math.max(MIN_BET, current - BET_STEP);
          return Math.min(maxAllowed, next);
        });
      } else if (e.key === 'Enter') {
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
          return;
        }
        e.preventDefault();
        handleConfirmBet();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, score, handleConfirmBet]);

  // Tiêu đề tab
  useEffect(() => {
    if (!questions.length || isBlankName) return undefined;
    const total = questions.length;
    if (status === 'betting') {
      document.title = `Câu ${currentIndex + 1}/${total} – đặt cược`;
    } else {
      document.title = `Câu ${currentIndex + 1}/${total} – cược ${bet}`;
    }

    return () => {
      document.title = 'Đặt cược kiến thức';
    };
  }, [status, currentIndex, bet, questions.length, isBlankName]);

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

  const handleUsePreview = () => {
    if (status === 'betting' && !usedSupports.preview) {
      setUsedSupports((prev) => ({ ...prev, preview: true }));
      setPreviewActive(true);
    }
  };

  const handleUseInsurance = () => {
    if ((status === 'betting' || status === 'answering') && !usedSupports.insurance) {
      setUsedSupports((prev) => ({ ...prev, insurance: true }));
      setInsuredCurrent(true);
    }
  };

  const handleUseHint = () => {
    if (status === 'answering' && !usedSupports.hint) {
      setUsedSupports((prev) => ({ ...prev, hint: true }));
      setHintActive(true);
    }
  };

  const renderFeedback = () => {
    if (status !== 'revealed' || !lastRoundResult) return null;
    if (lastRoundResult.correct) {
      return (
        <p className="feedback-text feedback-correct">
          {`+${formatScore(lastRoundResult.change)}`}
        </p>
      );
    }
    if (lastRoundResult.insuredSaved) {
      return (
        <p className="feedback-text feedback-insured">
          Bảo hiểm: không bị trừ điểm
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
      <Supports
        status={status}
        usedSupports={usedSupports}
        insuredCurrent={insuredCurrent}
        onUsePreview={handleUsePreview}
        onUseInsurance={handleUseInsurance}
        onUseHint={handleUseHint}
      />

      {status === 'betting' ? (
        <BetPanel
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          question={currentQuestion}
          score={score}
          bet={bet}
          setBet={setBet}
          onConfirmBet={handleConfirmBet}
          previewActive={previewActive}
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
            hintActive={hintActive}
          />

          {renderFeedback()}
        </div>
      )}
    </div>
  );
};

export default Play;
