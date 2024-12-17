interface Logo {
  uid: string;
  display_name: string;
  logo_url: string;
}

interface LogoResponse {
  payload: Logo[];
}

interface LogoParams {
  brand_kit_uid: string;
  initial_size?: string;
  project_uid?: string;
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

  async getAllLogos(params: LogoParams): Promise<LogoResponse> {
    try {
      const queryParams = new URLSearchParams({
        brand_kit_uid: params.brand_kit_uid,
        ...(params.initial_size && { initial_size: params.initial_size }),
        ...(params.project_uid && { project_uid: params.project_uid })
      });

      const response = await fetch(`${this.baseUrl}/vividly/logos?${queryParams}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching logos:', error);
      throw error;
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