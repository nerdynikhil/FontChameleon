document.getElementById('replace-font').addEventListener('click', () => {
    const currentFontSelect = document.getElementById('current-font-select');
    const newFontSelect = document.getElementById('new-font-select');
    let currentFont = currentFontSelect.value;
    let newFont = newFontSelect.value;
  
    if (currentFont === 'custom') {
      currentFont = document.getElementById('current-custom-font').value;
    }
    if (newFont === 'custom') {
      newFont = document.getElementById('new-custom-font').value;
    }
  
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: replaceFont,
        args: [currentFont, newFont]
      });
    });
  });
  
  document.getElementById('current-font-select').addEventListener('change', () => {
    const currentFontSelect = document.getElementById('current-font-select');
    const currentCustomFont = document.getElementById('current-custom-font');
    if (currentFontSelect.value === 'custom') {
      currentCustomFont.style.display = 'block';
    } else {
      currentCustomFont.style.display = 'none';
    }
  });
  
  document.getElementById('new-font-select').addEventListener('change', () => {
    const newFontSelect = document.getElementById('new-font-select');
    const newCustomFont = document.getElementById('new-custom-font');
    if (newFontSelect.value === 'custom') {
      newCustomFont.style.display = 'block';
    } else {
      newCustomFont.style.display = 'none';
    }
  });
  
  function replaceFont(currentFont, newFont) {
    // Update inline styles
    const elements = document.body.getElementsByTagName('*');
    for (let element of elements) {
      const style = window.getComputedStyle(element);
      if (style.fontFamily.includes(currentFont)) {
        element.style.fontFamily = style.fontFamily.replace(currentFont, newFont);
      }
    }
  
    // Update stylesheets
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          if (rule.style && rule.style.fontFamily && rule.style.fontFamily.includes(currentFont)) {
            rule.style.fontFamily = rule.style.fontFamily.replace(currentFont, newFont);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  
  function enableFontDetection() {
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
  }
  
  function handleMouseOver(event) {
    const element = event.target;
    const style = window.getComputedStyle(element);
    const fontFamily = style.fontFamily;
  
    const fontInfo = document.createElement('div');
    fontInfo.id = 'font-info';
    fontInfo.style.position = 'fixed';
    fontInfo.style.background = 'yellow';
    fontInfo.style.border = '1px solid black';
    fontInfo.style.padding = '5px';
    fontInfo.style.zIndex = '10000';
    fontInfo.textContent = `Font: ${fontFamily}`;
  
    document.body.appendChild(fontInfo);
  
    element.addEventListener('mousemove', handleMouseMove);
  }
  
  function handleMouseMove(event) {
    const fontInfo = document.getElementById('font-info');
    fontInfo.style.left = `${event.pageX + 15}px`;
    fontInfo.style.top = `${event.pageY + 15}px`;
  }
  
  function handleMouseOut(event) {
    const element = event.target;
    document.body.removeChild(document.getElementById('font-info'));
    element.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
  }
  