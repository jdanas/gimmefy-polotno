# Gimmefy Polotno

This is a Next.js application.

## Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jdanas/gimmefy-polotno.git
    cd gimmefy-polotno
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Embedding the Vividly App

# Vividly Editor Embed Script

This repository contains the `embed.js` script, which allows you to embed the Vividly Editor into your web application. The script provides a customizable editor interface that can be integrated seamlessly.

## Understanding `embed.js`

The `embed.js` script defines a function `createVividlyEditor(config)` that initializes and embeds the Vividly Editor into your web application. Here is a breakdown of its key components:

- **Event Listeners**: The script listens for specific messages from the embedded iframe, such as `publish` and `textToImage`, and triggers corresponding callback functions defined in the `config` object.
- **Container Creation**: A container div is created and styled to cover the entire viewport. This container holds the backdrop and the iframe.
- **Backdrop**: A semi-transparent backdrop is added to the container, which closes the editor when clicked.
- **Iframe Setup**: An iframe is created and styled to display the editor. The source URL of the iframe is constructed using the `editorUrl` and `token` from the `config` object.
- **Initial Data**: If `initialData` is provided in the `config`, it is sent to the iframe once it loads.
- **Custom Uploads**: If an `uploadHandler` is provided, the script listens for `upload` messages and handles file uploads accordingly.

## Embedding the Editor

To embed the Vividly Editor in your application, follow these steps:

1. **Include the Script**: Add the `embed.js` script to your HTML file.
    ```html
    <script src="path/to/embed.js"></script>
    ```

2. **Initialize the Editor**: Call the `createVividlyEditor` function with the appropriate configuration.
    ```javascript
    const editor = createVividlyEditor({
      token: 'your-auth-token',
      editorUrl: 'https://your-editor-url.com',
      onPublish: (data) => console.log('Published:', data),
      onTextToImageButtonClick: (data) => console.log('Text to Image clicked:', data),
      uploadHandler: async (file) => {
        // Handle file upload
        return 'https://uploaded-file-url.com';
      },
      initialData: {
        // Initial data to load into the editor
      },
      width: 800, // Optional: specify width
      height: 600, // Optional: specify height
      sections: ['section1', 'section2'] // Optional: specify sections
    });
    ```

3. **Destroy the Editor**: When you need to remove the editor, call the `destroy` method.
    ```javascript
    editor.destroy();
    ```

4. **Send Messages to the Iframe**: You can send custom messages to the iframe using the `sendMessage` method.
    ```javascript
    editor.sendMessage({ type: 'customMessage', data: 'your-data' });
    ```

## Example Usage

Here is an example of how to use the `createVividlyEditor` function in your application:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Embed Vividly Editor</title>
  <script src="path/to/embed.js"></script>
</head>
<body>
  <button id="open-editor">Open Editor</button>

  <script>
    document.getElementById('open-editor').addEventListener('click', () => {
      const editor = createVividlyEditor({
        token: 'your-auth-token',
        editorUrl: 'https://your-editor-url.com',
        onPublish: (data) => console.log('Published:', data),
        onTextToImageButtonClick: (data) => console.log('Text to Image clicked:', data),
        uploadHandler: async (file) => {
          // Handle file upload
          return 'https://uploaded-file-url.com';
        },
        initialData: {
          // Initial data to load into the editor
        }
      });
    });
  </script>
</body>
</html>

```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs the linter.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
