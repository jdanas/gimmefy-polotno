import { Toolbar } from 'polotno/toolbar/toolbar';
import type { Store } from 'polotno/model/store';

interface CustomToolbarProps {
  store: Store;
}

// Define custom toolbar items
const saveTemplateButton = {
  type: 'custom',
  render: () => (
    <button
      onClick={() => {
        console.log('Custom action');
      }}
      style={{
        padding: '10px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
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
      Save Template
    </button>
  ),
};

const CustomToolbar = ({ store }: CustomToolbarProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Toolbar 
        store={store} 
        downloadButtonEnabled 
        components={{
          saveTemplate: saveTemplateButton,
        }}
      />
    </div>
  );
};

export default CustomToolbar;
