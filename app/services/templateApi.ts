// templateApi.ts
interface Template {
  uid: string;
  name: string;
  description: string;
  thumbnail_url: string;
  category: string;
  type: "main-template" | "text-template";
  is_bookmarked: number;
  content?: string;
}

interface TemplateResponse {
  success: boolean;
  message: string;
  payload: Template[];
  meta: {
    totalRecords: number;
  };
}

interface DetailedTemplate extends Template {
  content: string;
  dimensions?: {
    width: number;
    height: number;
  };
  pages?: Array<{
    elements: Array<any>;
  }>;
}

interface DetailedTemplateResponse {
  success: boolean;
  message: string;
  payload: DetailedTemplate;
}



export class TemplateApiService {
  private baseUrl: string;
  private headers: HeadersInit;
  private token: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apidev.gimmefy.ai/v2';
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGVfaWQiOjEsIm9yZ2FuaXNhdGlvbl9pZCI6MSwicGFydG5lcl9pZCI6MSwiaWF0IjoxNzMzNzI2MTY0LCJleHAiOjE3MzQzMzA5NjR9.XD0SAul4LmgGZ5zOCfSAotDA9mac4HwCCpajiptRyx8';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async getTemplates(type: 'main-template' | 'text-template' = 'main-template'): Promise<TemplateResponse> {
    try {
      const url = `${this.baseUrl}/vividly/templates/${type}`;
      console.log(`Fetching templates from: ${url}`);

      const response = await fetch(url, {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      const data: TemplateResponse = await response.json();
      return data;
    } catch (err) {
      console.error('Template fetch failed:', err);
      throw err;
    }
  }

  async getTemplateById(templateId: string): Promise<Template> {
    const response = await fetch(`${this.baseUrl}/vividly/templates/${templateId}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`);
    }

    const data = await response.json();
    return data.payload;
  }

  async getTemplateDetails(uid: string): Promise<DetailedTemplate> {
    try {
      console.log(`Fetching template details for UID: ${uid}`);
      
      const url = `${this.baseUrl}/vividly/templates/${uid}`;
      const response = await fetch(url, {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch template details: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Response:', responseText);

      const data: DetailedTemplateResponse = JSON.parse(responseText);
      
      if (!data.success) {
        throw new Error(`API Error: ${data.message}`);
      }

      return data.payload;
    } catch (err) {
      console.error('Template details fetch failed:', err);
      throw err;
    }
  }
}