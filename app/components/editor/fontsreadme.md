Working with fonts
store.addFont({ fontFamily, url })​
The function to add a new custom font to the user project. Added fonts will be saved into exported JSON. If you want to add fonts available globally (ignored in JSON export), take a look into Fonts Tutorial.

store.addFont({
  fontFamily: 'MyCustomFont',
  url: serverUrlOrBase64,
});


Also you can use a richer API for more control:

store.addFont({
  fontFamily: 'MyCustomFont',
  styles: [
    {
      src: 'url(pathToNormalFile.ttf)',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: 'url(pathToBoldFile.ttf)',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
});


Or you can just register font in the store and then manually add required CSS into the page:

store.addFont({
  fontFamily: 'MyCustomFont',
});


store.removeFont(name)​
Remove custom font from the store by its name

store.removeFont('MyCustomFont');


store.loadFont(name)​
Prepare the font to use on the webpage. Text elements inside <Workarea> will use this function automatically. But it can be useful if you want to show a list of fonts somewhere in the UI. store.loadFont(name) function will add font to the webpage, so the browser can render correct font.