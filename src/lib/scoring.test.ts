import { scorePrompt } from "./scoring";

test("overall score is between 0 and 100", () => {
  const result = scorePrompt({
    clarity: 5,
    specificity: 3,
    safety: 2,
  });

  expect(result.overall).toBeGreaterThanOrEqual(0);
  expect(result.overall).toBeLessThanOrEqual(100);
});
