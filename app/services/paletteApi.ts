interface Palette {
  uid: string;
  display_name: string;
  colors: string[];
  category: string;
}

interface PaletteResponse {
  payload: Palette[];
}

export class PaletteAPI {
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

  async getAllPalettes(): Promise<Palette[]> {
    if (!this.token) {
      await this.login('shalu.wasu@teemuno.com', 'P12345678');
    }

    try {
      const response = await fetch(`${this.baseUrl}/vividly/palettes`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch palettes: ${response.status}`);
      }

      const data: PaletteResponse = await response.json();
      return data.payload;
    } catch (err) {
      console.error('Palette fetch failed:', err);
      throw err;
    }
  }

  async getPalettesByBrandKit(brandKitUid: string): Promise<Palette[]> {
    if (!this.token) {
      await this.login('shalu.wasu@teemuno.com', 'P12345678');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/vividly/palettes?brand_kit_uid=${brandKitUid}`,
        {
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch brand kit palettes: ${response.status}`);
      }

      const data: PaletteResponse = await response.json();
      return data.payload;
    } catch (err) {
      console.error('Brand kit palette fetch failed:', err);
      throw err;
    }
  }
}

export default PaletteAPI;