export interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  categoryId?: string;
  topicId?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  content: string;
  relatedTopics?: string[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'home' | 'category' | 'topic';
}

export interface SearchResult {
  type: 'category' | 'topic';
  id: string;
  name: string;
  content: string;
  categoryId?: string;
  relevance: number;
}