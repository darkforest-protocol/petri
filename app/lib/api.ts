// API client for interacting with the analysis backend

const API_BASE_URL = 'http://localhost:3001/api/v1';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AnalysisRequest {
  prompt: string;
  use_cache?: boolean;
  num_completions?: number;
}

export interface AnalysisResponse {
  request_id: string;
}

export interface AnalysisStatusResponse {
  status: AnalysisStatus;
  timestamp: string;
}

export interface CitationMetadata {
  order: number;
  reference_style: string;
  total_citations?: number;
  snippet?: string;
}

export interface Source {
  url: string;
  title: string;
  content: string;
  description: string;
  source_type: string;
  citation_metadata: {
    order: number;
    reference_style: string;
    total_citations: number;
  };
}

export interface TargetPageContent {
  content: string;
  summary: string;
  title: string;
  url: string;
  metadata: {
    source_type: string;
    domain: string;
    is_target_page: boolean;
    google_snippet: string;
    citation_metadata: {
      order: number;
      snippet: string;
      reference_style: string;
    };
  };
}

export interface AnalysisResults {
  content: string;
  sources: Source[];
  target_page_info: {
    target_page_found: boolean;
    target_page_source: 'primary' | 'secondary';
    target_domain: string;
    target_content: TargetPageContent;
  };
  calculated_metrics: {
    scores: {
      word_position: number[];
      word_count: number[];
      citation_quality: number[];
    };
    metadata: {
      total_citations: number;
      has_citations: boolean;
    };
  };
}

export interface StartAnalysisRequest {
  prompt: string;
  use_cache?: boolean;
  num_completions?: number;
}

export interface StartAnalysisResponse {
  request_id: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function startAnalysis(request: StartAnalysisRequest): Promise<StartAnalysisResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to start analysis');
  }

  return response.json();
}

export async function getAnalysisStatus(requestId: string): Promise<AnalysisStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/analysis/${requestId}/status`);

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to get analysis status: ${response.statusText}`);
  }

  return response.json();
}

export async function getAnalysisResults(requestId: string): Promise<AnalysisResults> {
  const response = await fetch(`${API_BASE_URL}/analysis/${requestId}`);

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to get analysis results: ${response.statusText}`);
  }

  return response.json();
}

// Polling utility function
export async function pollAnalysisCompletion(
  requestId: string,
  onStatusUpdate: (status: AnalysisStatus) => void,
  interval: number = 2000,
  maxAttempts: number = 30
): Promise<AnalysisResults> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`/api/analyze/${requestId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analysis status');
    }

    const data = await response.json();
    onStatusUpdate(data.status);

    if (data.status === 'completed') {
      return data.results;
    }

    if (data.status === 'failed') {
      throw new Error('Analysis failed');
    }

    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error('Analysis timed out');
} 