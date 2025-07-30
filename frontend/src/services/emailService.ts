export interface Email {
  subject: string;
  text: string;
  folder: string;
  account: string;
  date: string;
  from: string;
  to: string[];
  category: string;
  uid: string;
}

export interface SearchParams {
  query?: string;
  folder?: string | null;
  account?: string | null;
  page?: number;
  size?: number;
  category?: string;
}

export interface SearchResponse {
  hits: Email[];
  total: { value: number };
}

const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchEmails(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.append('query', params.query);
  if (params.folder) searchParams.append('folder', params.folder);
  if (params.account) searchParams.append('account', params.account);
  if (params.category) searchParams.append('category', params.category);
  if (params.size) searchParams.append('size', params.size.toString());
  
  const response = await fetch(`${API_BASE_URL}/emails?${searchParams}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchAccounts(): Promise<{ accounts: Array<{ value: string; label: string }> }> {
  const response = await fetch(`${API_BASE_URL}/accounts`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchFolders(): Promise<{ folders: Array<{ value: string; label: string }> }> {
  const response = await fetch(`${API_BASE_URL}/folders`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
} 