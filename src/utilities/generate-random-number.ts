export function generateRandomQRCode(): number {
  let randomNumber = 0;

  for (let i = 0; i < 8; i++) {
    randomNumber = randomNumber * 10 + getRandomSingleDigit();
  }

  return randomNumber;
}

function getRandomSingleDigit(): number {
  return Math.floor(Math.random() * 9) + 1;
}

export function generateOTPForEmail(): number {
  let randomNumber = 0;

  for (let i = 0; i < 6; i++) {
    randomNumber = randomNumber * 10 + getRandomSingleDigit();
  }

  return randomNumber;
}
