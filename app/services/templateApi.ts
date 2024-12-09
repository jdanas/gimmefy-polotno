// app/services/templateApi.ts
interface TemplateResponse {
    success: boolean;
    message: string;
    payload: Template[];
    meta: {
      totalRecords: number;
    };
  }
  
  interface Template {
    uid: string;
    name: string;
    description: string;
    thumbnail_url: string;
    category: string;
    type: string;
    is_bookmarked: number;
    content?: string;
  }

interface LoginResponse {
  success: boolean;
  message: string;
  payload: {
    accessToken: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export class TemplateApiService {
  private baseUrl: string;
  private headers: HeadersInit;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apidev.gimmefy.ai/v2';
    this.token = null;
    this.headers = {
      'Content-Type': 'application/json'
    };
    // Don't auto-initialize here
  }

  private async initialize() {
    try {
      await this.login({
        email: "shalu.wasu@teemuno.com",
        password: "P12345678"
      });
      // Optional: Store token in localStorage
      localStorage.setItem('auth_token', this.token || '');
    } catch (error) {
      console.error('Auto-login failed:', error);
      // Try to recover from localStorage
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        this.token = savedToken;
        this.updateHeaders();
      }
    }
  }

  private updateHeaders() {
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${this.token}`
    };
  }

  private async ensureAuth(): Promise<void> {
    if (!this.token) {
      await this.initialize();
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/login`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    this.token = data.payload.accessToken;
    this.headers = {
      ...this.headers,
      'Authorization': `Bearer ${this.token}`
    };
  }

  private getAuthHeaders(): HeadersInit {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first');
    }
    return this.headers;
  }

  // Add debug logging
  async getTemplates(): Promise<TemplateResponse> {
    console.log('Headers before request:', this.headers);
    await this.ensureAuth();
    console.log('Headers after auth:', this.headers);
    
    const response = await fetch(`${this.baseUrl}/templates`, {
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async createTemplate(template: Partial<Template>): Promise<TemplateResponse> {
    const response = await fetch(`${this.baseUrl}/templates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(template)
    });
    if (!response.ok) {
      throw new Error('Failed to create template');
    }
    return response.json();
  }

  async getTemplateById(uid: string): Promise<TemplateResponse> {
    const response = await fetch(`${this.baseUrl}/templates/${uid}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }
    return response.json();
  }

  async updateTemplate(uid: string, template: Partial<Template>): Promise<TemplateResponse> {
    const response = await fetch(`${this.baseUrl}/templates/${uid}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(template)
    });
    if (!response.ok) {
      throw new Error('Failed to update template');
    }
    return response.json();
  }

  async deleteTemplate(uid: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/templates/${uid}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
  }
}

// Usage example:
// const api = new TemplateApiService();
// await api.login({
//   email: "shalu.wasu@teemuno.com",
//   password: "P12345678"
// });
// const templates = await api.getTemplates();