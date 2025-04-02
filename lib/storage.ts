interface StoredAnalysis {
  prompt: string;
  requestId: string;
  timestamp: number;
}

const STORAGE_KEY = 'prompt-analyses';

export function getStoredAnalyses(): StoredAnalysis[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function storeAnalysis(prompt: string, requestId: string) {
  const analyses = getStoredAnalyses();
  const newAnalysis: StoredAnalysis = {
    prompt,
    requestId,
    timestamp: Date.now()
  };
  
  // Remove any existing analysis for this prompt
  const filtered = analyses.filter(a => a.prompt !== prompt);
  
  // Add new analysis and sort by timestamp
  const updated = [...filtered, newAnalysis]
    .sort((a, b) => b.timestamp - a.timestamp);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeAnalysis(prompt: string) {
  const analyses = getStoredAnalyses();
  const updated = analyses.filter(a => a.prompt !== prompt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredRequestId(prompt: string): string | null {
  const analyses = getStoredAnalyses();
  const analysis = analyses.find(a => a.prompt === prompt);
  return analysis?.requestId || null;
} 