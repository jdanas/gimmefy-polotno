// templateApi.ts
interface LoginResponse {
  success: boolean;
  message: string;
  payload: {
    accessToken: string;
  };
}

interface TemplateResponse {
  templates: any[]; // Adjust the type according to your actual response structure
}

interface TemplateDetailResponse {
  success: boolean;
  message: string;
  payload: {
    uid: string;
    name: string;
    description: string;
    content: string;
    thumbnail_url: string;
    category: string;
    type: string;
  };
}

export class TemplateApiService {
  private baseUrl: string;
  private headers: HeadersInit;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apidev.gimmefy.ai/v2';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      this.token = data.payload.accessToken;
      this.headers = {
        ...this.headers,
        'Authorization': `Bearer ${this.token}`
      };
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  }

  async getTemplates(): Promise<TemplateResponse> {
    if (!this.token) {
      await this.login('shalu.wasu@teemuno.com', 'P12345678');
    }

    try {
      const response = await fetch(`${this.baseUrl}/vividly/templates?type=main-template`, {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      console.error('Request failed:', err);
      throw err;
    }
  }


  async getTemplateById(uid: string): Promise<TemplateDetailResponse> {
    if (!this.token) {
      await this.login('shalu.wasu@teemuno.com', 'P12345678');
    }

    try {
      console.log(`Fetching template: ${uid}`);
      const response = await fetch(
        `${this.baseUrl}/vividly/templates/${uid}?type=main-template`, 
        {
          headers: this.headers,
          method: 'GET'
        }
      );

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`);
      }

      return JSON.parse(responseText);
    } catch (err) {
      console.error('Template fetch failed:', err);
      throw err;
    }
  }


}