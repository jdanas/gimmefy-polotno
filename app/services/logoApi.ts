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

  async getAllLogos(params: { brand_kit_uid: string }): Promise<LogoResponse> {
    try {
      const queryParams = new URLSearchParams({
        brand_kit_uid: params.brand_kit_uid
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
      if (!this.token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const queryParams = new URLSearchParams({
        action: 'WRITE',
        asset_type: 'BRAND_KIT_LOGO',
        file_name: fileName,
        source: 'BRAND_KIT',
        source_id: brandKitUid
      }).toString();

      const response = await fetch(`${this.baseUrl}/vividly/signed-url?${queryParams}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get signed URL (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      if (!data.payload?.url) {
        throw new Error('Invalid response format: missing URL in payload');
      }

      return data;
    } catch (err) {
      console.error('Error getting signed URL:', err);
      throw err;
    }
  }

  async uploadLogoToS3(file: File, brandKitUid: string) {
    try {
      if (!this.token) {
        throw new Error('Not authenticated. Please login first.');
      }

      // Generate a unique filename with safe characters
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}-${safeFileName}`;
      
      // Get signed URL
      const signedUrlResponse = await this.getSignedUploadUrl(uniqueFileName, brandKitUid);
      
      if (!signedUrlResponse?.payload?.url) {
        throw new Error('Invalid signed URL response');
      }

      const { url: signedUrl } = signedUrlResponse.payload;

      // Upload to S3
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read', // Ensure the uploaded file is publicly readable
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload file to S3 (${uploadResponse.status}): ${errorText}`);
      }

      // Get the permanent URL by removing the query parameters
      const permanentUrl = signedUrl.split('?')[0];

      return {
        fileName: uniqueFileName,
        fileUrl: permanentUrl,
        signedUrl
      };
    } catch (err) {
      console.error('Error uploading logo:', err);
      throw err;
    }
  }
}