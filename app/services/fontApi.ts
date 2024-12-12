// services/fontApi.ts
interface Font {
    uid: string;
    display_name: string;
    font_url: string;
    category: string;
  }
  
  interface FontResponse {
    payload: Font[];
  }
  
  export class FontAPI {
    private baseUrl: string;
    private token: string | null;
    
    constructor() {
      this.baseUrl = 'https://apidev.gimmefy.ai/v2';
      this.token = null;
    }
  
    private get headers() {
      return {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      };
    }
  
    async login(email: string, password: string) {
      try {
        const response = await fetch(`${this.baseUrl}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
  
        const data = await response.json();
        this.token = data.payload.accessToken;
      } catch (err) {
        console.error('Login failed:', err);
        throw err;
      }
    }
  
    async getAllFonts(): Promise<Font[]> {
      if (!this.token) {
        await this.login('shalu.wasu@teemuno.com', 'P12345678');
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/vividly/fonts`, {
          headers: this.headers,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch fonts: ${response.status}`);
        }
  
        const data: FontResponse = await response.json();
        return data.payload;
      } catch (err) {
        console.error('Font fetch failed:', err);
        throw err;
      }
    }
  
    async getFontsByBrandKit(brandKitUid: string): Promise<Font[]> {
      if (!this.token) {
        await this.login('shalu.wasu@teemuno.com', 'P12345678');
      }
  
      try {
        const response = await fetch(
          `${this.baseUrl}/vividly/fonts?brand_kit_uid=${brandKitUid}`,
          {
            headers: this.headers,
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch brand kit fonts: ${response.status}`);
        }
  
        const data: FontResponse = await response.json();
        return data.payload;
      } catch (err) {
        console.error('Brand kit font fetch failed:', err);
        throw err;
      }
    }
  }
  
  export default FontAPI;