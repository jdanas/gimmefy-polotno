interface Logo {
  uid: string;
  display_name: string;
  logo_url: string;
}

interface LogoResponse {
  payload: Logo[];
}

export class LogoAPI {
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
      console.error('Login error:', err);
      throw err;
    }
  }

  async getAllLogos(brandKitUid?: string) {
    try {
      const url = brandKitUid 
        ? `${this.baseUrl}/logos?brand_kit_uid=${brandKitUid}`
        : `${this.baseUrl}/logos`;

      const response = await fetch(url, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logos');
      }

      return await response.json() as LogoResponse;
    } catch (err) {
      console.error('Error fetching logos:', err);
      throw err;
    }
  }

  async getSignedUploadUrl(fileName: string, brandKitUid: string) {
    try {
      const url = `${this.baseUrl}/signed-url?action=WRITE&asset_type=BRAND_KIT_LOGO&file_name=${fileName}&source=BRAND_KIT&source_id=${brandKitUid}`;
      
      const response = await fetch(url, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      return await response.json();
    } catch (err) {
      console.error('Error getting signed URL:', err);
      throw err;
    }
  }
}