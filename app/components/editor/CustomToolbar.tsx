import { Toolbar } from 'polotno/toolbar/toolbar';
import type { Store } from 'polotno/model/store';
import { TemplateApiService } from '../../services/templateApi';
import { useState } from 'react';

interface CustomToolbarProps {
  store: Store;
  onTemplateSaved?: () => void;  // Add this prop
}

const CustomToolbar = ({ store, onTemplateSaved }: CustomToolbarProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveTemplate = async () => {
    try {
      setIsSaving(true);
      
      const templateData = store.toJSON();
      const base64Image = await store.toDataURL();
      
      const templateApiService = new TemplateApiService();
      
      await templateApiService.createTemplate({
        name: `Template ${new Date().toISOString()}`,
        description: 'Template created from editor',
        content: JSON.stringify(templateData),
        type: 'main-template',
        base64Image: base64Image.split(',')[1] // Remove data:image/png;base64, prefix
      });

      alert('Template saved successfully!');
      
      // Trigger reload after successful save
      if (onTemplateSaved) {
        onTemplateSaved();
      }
      // Alternatively, you can force a page reload
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving template:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Response:', await error.response.text());
      }
      alert('Failed to save template: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={saveTemplate}
        disabled={isSaving}
        style={{
          marginLeft: '10px',
          padding: '10px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          opacity: isSaving ? 0.7 : 1,
          width: '180px',
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        {isSaving ? 'Saving...' : 'Save Template'}
      </button>
      <Toolbar store={store} downloadButtonEnabled />
    </div>
  );
};

export default CustomToolbar;
