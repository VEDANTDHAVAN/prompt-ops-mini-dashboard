// rubric scoring logic
export function scorePrompt(
  weights: {
    clarity: number;
    specificity: number;
    safety: number;
  }
) {
  const clarity = randomScore();
  const specificity = randomScore();
  const safety = randomScore();

  const totalWeight =
    weights.clarity + weights.specificity + weights.safety;

  const normalized = {
    clarity: weights.clarity / totalWeight,
    specificity: weights.specificity / totalWeight,
    safety: weights.safety / totalWeight,
  };
  
  const overall = clarity * normalized.clarity + specificity * normalized.specificity +
    safety * normalized.safety;

  return {
    clarity,
    specificity,
    safety,
    overall: Math.round(overall),
  };
}

function randomScore() {
  return Math.floor(Math.random() * 41) + 60; // 60–100
}
