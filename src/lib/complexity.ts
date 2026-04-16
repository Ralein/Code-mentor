export type ComplexityLevel = "simple" | "moderate" | "complex";

export interface LineComplexity {
  lineNumber: number;
  complexity: ComplexityLevel;
  score: number;
}

export function calculateLineComplexity(line: string, index: number): LineComplexity {
  const trimmed = line.trim();
  if (!trimmed) return { lineNumber: index + 1, complexity: "simple", score: 0 };

  // Heuristics
  const tokenCount = trimmed.split(/\s+/).length;
  const operatorCount = (trimmed.match(/[+\-*\/%=&|<>!^~?:]/g) || []).length;
  const nestingDepth = (line.match(/^\s*/)?.[0].length || 0) / 2; // Assuming 2-space indentation
  const charLength = trimmed.length;

  // Simple weighted score
  const score = (tokenCount * 0.5) + (operatorCount * 1.5) + (nestingDepth * 2) + (charLength * 0.05);

  let complexity: ComplexityLevel = "simple";
  if (score > 15) complexity = "complex";
  else if (score > 8) complexity = "moderate";

  return {
    lineNumber: index + 1,
    complexity,
    score: Math.min(100, Math.round(score * 5)),
  };
}

export function analyzeCodeComplexity(code: string): LineComplexity[] {
  const lines = code.split("\n");
  return lines.map((line, i) => calculateLineComplexity(line, i));
}
