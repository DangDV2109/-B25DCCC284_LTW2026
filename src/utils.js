import { MIN_BET, MAX_BET, BET_STEP, MULTIPLIERS, RESULTS } from './data';

export const validateBet = (bet, score) => {
  const num = Number(bet);
  if (
    bet === '' ||
    Number.isNaN(num) ||
    num < MIN_BET ||
    num > MAX_BET ||
    num > score ||
    num % BET_STEP !== 0
  ) {
    return 'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';
  }
  return '';
};

export const calcChange = (bet, level, correct) => {
  const numBet = Number(bet);
  if (correct) {
    return numBet * MULTIPLIERS[level];
  }
  return -numBet;
};

export const getResult = (score) => {
  const found = RESULTS.find((item) => score >= item.min);
  return found ? found.title : 'Cháy túi';
};
