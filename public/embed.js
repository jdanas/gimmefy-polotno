// public/embed.js
function createVividlyEditor(config) {
    // Listen for publish event
    const handlePublish = (event) => {
      if (event.data?.type !== 'publish') {
        return;
      }
      if (event.data?.dataURL && config.onPublish) {
        config.onPublish({ ...event.data });
        destroy();
      }
    };
    window.addEventListener('message', handlePublish, false);
  
    // Listen for text-to-image button click
    const handleTextToImage = (event) => {
      if (event.data?.type !== 'textToImage') {
        return;
      }
      if (config.onTextToImageButtonClick) {
        config.onTextToImageButtonClick({ ...event.data });
      }
    };
    window.addEventListener('message', handleTextToImage, false);
  
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0px';
    container.style.left = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '10000';
  
    document.body.appendChild(container);
  
    const backdrop = document.createElement('div');
    backdrop.className = 'vividly-backdrop';
    backdrop.style.position = 'absolute';
    backdrop.style.top = '0px';
    backdrop.style.left = '0px';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
    backdrop.style.display = 'block';
    container.appendChild(backdrop);
    backdrop.onclick = () => {
      destroy();
    };
  
    const destroy = () => {
      window.removeEventListener('message', handlePublish, false);
      window.removeEventListener('message', handleTextToImage, false);
      container.parentElement.removeChild(container);
    };
  
    // Setup iframe
    const iframe = document.createElement('iframe');
    container.appendChild(iframe);
    iframe.className = 'vividly-iframe';
    iframe.style.width = 'calc(100vw - 50px)';
    iframe.style.height = window.innerHeight - 60 + 'px';
    iframe.style.minWidth = '400px';
    iframe.style.maxWidth = '100vw';
    iframe.style.position = 'absolute';
    iframe.style.top = '50px';
    iframe.style.left = '50%';
    iframe.style.transform = 'translate(-50%)';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '5px';
  
    window.addEventListener('resize', () => {
      iframe.style.height = window.innerHeight - 60 + 'px';
    });
  
    // Construct iframe source URL with token
    let src = `${config.editorUrl || window.location.origin}?token=${config.token}`;
    
    if (config.width) src += `&width=${config.width}`;
    if (config.height) src += `&height=${config.height}`;
    
    if (config.sections) {
      if (config.sections.length === 0) {
        src += '&sections=false';
      } else {
        src += `&sections=${config.sections.join(',')}`;
      }
    }
  
    iframe.src = src;
  
    iframe.onload = () => {
      setTimeout(() => {
        console.log('Sending brand_kit_uid:', config.brand_kit_uid);
        iframe.contentWindow.postMessage({
          type: 'INIT',
          brand_kit_uid: config.brand_kit_uid
        }, '*');
      }, 100);
    };
  
    // Pass initial data to iframe
    if (config.initialData) {
      iframe.addEventListener('load', () => {
        iframe.contentWindow.postMessage(
          {
            type: 'loadInitialData',
            data: config.initialData,
          },
          '*'
        );
      });
    }
  
    // Handle custom uploads
    if (config.uploadHandler) {
      window.addEventListener('message', async (event) => {
        if (event.data?.type === 'upload') {
          try {
            const url = await config.uploadHandler(event.data.file);
            iframe.contentWindow.postMessage(
              {
                type: 'uploadComplete',
                url,
                id: event.data.id
              },
              '*'
            );
          } catch (error) {
            iframe.contentWindow.postMessage(
              {
                type: 'uploadError',
                error: error.message,
                id: event.data.id
              },
              '*'
            );
          }
        }
      });
    }
  
    return {
      destroy,
      iframe,
      sendMessage: (message) => {
        iframe.contentWindow.postMessage(message, '*');
      }
    };
  }
  
  // Example usage:
  // const editor = createVividlyEditor({
  //   token: 'your-auth-token',
  //   editorUrl: 'https://your-editor-url.com',
  //   onPublish: (data) => console.log('Published:', data),
  //   onTextToImageButtonClick: (data) => console.log('Text to Image clicked:', data),
  //   uploadHandler: async (file) => {
  //     // Handle file upload
  //     return 'https://uploaded-file-url.com';
  //   }
  // });
  
  window.createVividlyEditor = createVividlyEditor;