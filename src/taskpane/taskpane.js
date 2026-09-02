let slides = [];
let tiles = [];

async function loadCatalog() {
  try {
    const response = await fetch('/assets/catalog.json');
    const catalogData = await response.json();
    slides = catalogData.slides || catalogData || [];
    tiles = (catalogData.tiles && Array.isArray(catalogData.tiles)) ? [...catalogData.tiles] : [];
    renderAll();
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e);
  }
}

const ICONS = {
  back1: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.47 4.217a.75.75 0 0 0 0 1.06L12.185 10 7.469 14.72a.75.75 0 1 0 1.062 1.06l5.245-5.25a.75.75 0 0 0 0-1.061L8.531 4.218a.75.75 0 0 0-1.061-.001z" fill="currentColor"/></svg>',
  back2: '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.6923 15C25.7577 15 25 15.8954 25 17C25 18.1046 25.7577 19 26.6923 19L45.3077 19C46.2423 19 47 18.1046 47 17C47 15.8954 46.2423 15 45.3077 15L26.6923 15Z" fill="black"/><path d="M30.6364 28C29.7326 28 29 28.8954 29 30C29 31.1046 29.7326 32 30.6364 32L45.3636 32C46.2674 32 47 31.1046 47 30C47 28.8954 46.2674 28 45.3636 28L30.6364 28Z" fill="black"/><path d="M34.5556 41C33.6964 41 33 41.8954 33 43C33 44.1046 33.6964 45 34.5556 45L45.4444 45C46.3036 45 47 44.1046 47 43C47 41.8954 46.3036 41 45.4444 41L34.5556 41Z" fill="black"/><path d="M36 17C36 15.8954 35.0357 15 33.8462 15L12.83 15L17.4142 10.4142C18.1352 9.69325 18.1906 8.55878 17.5806 7.7742L17.4142 7.58578C16.6332 6.80474 15.3668 6.80474 14.5858 7.58578L6.58579 15.5858C5.80474 16.3668 5.80474 17.6332 6.58579 18.4142L14.5858 26.4142C15.3668 27.1953 16.6332 27.1953 17.4142 26.4142C18.1953 25.6332 18.1953 24.3668 17.4142 23.5858L12.83 19L33.8462 19C34.9564 19 35.8704 18.22 35.9874 17.2179L36 17Z" fill="black"/></svg>',
  heart1: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.992 4.006c-1.452.064-2.753.637-3.881 1.694l-.117.113-.122-.118C10.662 4.576 9.275 4 7.734 4 4.577 4 2 6.56 2 9.717c0 3.088 1.127 4.552 6.182 8.546l2.688 2.098a1.84 1.84 0 0 0 2.26 0l2.364-1.843.933-.74C20.965 14.144 22 12.676 22 9.718 22 6.56 19.423 4 16.266 4zm.274 1.794c2.165 0 3.934 1.757 3.934 3.917l-.005.294c-.076 2.156-1.062 3.341-5.509 6.852l-2.663 2.078a.04.04 0 0 1-.046 0l-2.364-1.843-.874-.691c-4.142-3.31-4.939-4.44-4.939-6.69C3.8 7.557 5.569 5.8 7.734 5.8c1.333 0 2.507.618 3.57 1.915a.9.9 0 0 0 1.398-.007C13.739 6.416 14.909 5.8 16.266 5.8"/></svg>',
  heart2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  presentation: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8.462 4h7.076c.948 0 1.714 0 2.334.05.64.053 1.203.163 1.726.43a4.4 4.4 0 0 1 1.922 1.922c.282.553.39 1.153.438 1.84a.9.9 0 0 1-1.796.126c-.04-.586-.123-.908-.245-1.148a2.6 2.6 0 0 0-1.137-1.137c-.226-.115-.527-.195-1.055-.238-.538-.044-1.23-.045-2.225-.045h-7c-.995 0-1.687 0-2.226.045-.527.043-.828.123-1.054.238A2.6 2.6 0 0 0 4.083 7.22c-.115.226-.195.527-.238 1.054-.04.477-.044 1.073-.045 1.894l4.46-1.952c1.693-.74 3.552.628 3.348 2.464l-.241 2.17a.6.6 0 0 0 1.02.49l2.977-2.976a.9.9 0 1 1 1.272 1.272l-2.976 2.977c-1.604 1.604-4.333.292-4.082-1.962l.24-2.17a.6.6 0 0 0-.836-.616L3.8 12.132V13.5c0 .995 0 1.687.045 2.226.043.527.123.828.238 1.054a2.6 2.6 0 0 0 1.137 1.137c.226.115.527.195 1.054.238.539.044 1.231.045 2.226.045h2.17a.9.9 0 0 1 0 1.8H8.462c-.948 0-1.714 0-2.334-.05-.64-.053-1.203-.163-1.726-.43a4.4 4.4 0 0 1-1.922-1.922c-.267-.523-.377-1.087-.43-1.726C2 15.252 2 14.486 2 13.538v-3.076c0-.948 0-1.714.05-2.334.053-.64.163-1.203.43-1.726A4.4 4.4 0 0 1 4.402 4.48c.523-.267 1.087-.377 1.726-.43C6.748 4 7.514 4 8.462 4Zm13.537 7.293a1.001 1.001 0 0 0-1.416 0l-.708.708 2.124 2.124.708-.708a1.001 1.001 0 0 0 0-1.416l-.708-.708Zm-.981 3.812-2.124-2.124-4.338 4.338c-.44.44-.77.976-.967 1.566l-.573 1.72a.3.3 0 0 0 .38.38l1.719-.574a4.005 4.005 0 0 0 1.565-.968l4.338-4.338Z"/></svg>',
  camera: '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="currentColor"><path fill-rule="evenodd" d="M19.08 6.66c.71-.568 1.71-1.16 2.92-1.16h12c1.21 0 2.21.592 2.92 1.16.724.578 1.326 1.28 1.74 1.773.03.035.236.295.53.666l.982 1.232c.13.162.478.417 1.086.634A5.4 5.4 0 0 0 43 11.28h1c2.449 0 4.492 1.27 5.872 3.144 1.37 1.86 2.128 4.35 2.128 7.013h-3c0-2.122-.607-3.962-1.543-5.234-.926-1.257-2.134-1.923-3.457-1.923h-1a8.4 8.4 0 0 1-2.75-.49c-.85-.303-1.797-.803-2.422-1.587-.379-.474-.741-.93-1.014-1.273l-.333-.419-.12-.15c-.409-.488-.846-.984-1.314-1.359C34.565 8.617 34.22 8.5 34 8.5H22c-.221 0-.565.117-1.047.502-.468.375-.905.87-1.314 1.358l-.022.028-.098.123-.333.419c-.273.343-.635.799-1.014 1.273-.625.784-1.571 1.284-2.422 1.588a8.4 8.4 0 0 1-2.75.489h-1c-1.323 0-2.53.666-3.457 1.923C7.607 17.475 7 19.315 7 21.437H4c0-2.664.757-5.152 2.128-7.013C7.508 12.55 9.55 11.28 12 11.28h1a5.5 5.5 0 0 0 1.742-.315c.608-.217.957-.473 1.086-.634l.98-1.232.532-.666c.414-.493 1.016-1.195 1.74-1.774M17 46.5V45h21c4.72 0 6.88-1.088 8.505-2.825.658-.703 1.234-1.695 1.727-2.79.351-.78.556-1.84.663-2.91A25 25 0 0 0 49 34V21.437h3v12.57c0 .508 0 1.568-.12 2.767-.118 1.181-.363 2.621-.912 3.841-.554 1.23-1.291 2.56-2.273 3.61C46.343 46.74 43.28 48 38 48H17.001zm-9.718-2.298c-1.013-1.051-1.776-2.347-2.307-3.629-.373-.903-.604-2.35-.747-3.535C4.08 35.804 4 34.582 4 34V21.437h3V34c0 .418.066 1.51.207 2.68.147 1.222.346 2.276.54 2.747.43 1.038 1.019 2.002 1.725 2.724l.047.048.042.051c.665.813 1.788 1.514 3.19 2.011 1.387.492 2.917.739 4.25.739L17 46.5V48c-1.668 0-3.538-.303-5.252-.911-1.675-.595-3.332-1.528-4.466-2.887" clip-rule="evenodd"/><path fill-rule="evenodd" d="M18 28c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10m10-7a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7" clip-rule="evenodd"/></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 28 28"><path fill-rule="evenodd" d="M10.692 3c-2.448 0-3.527.216-4.623.801A5.466 5.466 0 0 0 3.801 6.07C3.216 7.165 3 8.244 3 10.692v6.616c0 2.448.216 3.527.801 4.622A5.465 5.465 0 0 0 6.07 24.2c1.096.585 2.175.801 4.623.801H13a1 1 0 1 0 0-2h-2.308c-2.335 0-3.019-.212-3.68-.565a3.59 3.59 0 0 1-.566-.374l2.943-2.943c.405-.405.667-.666.882-.849.206-.175.304-.22.356-.237a1 1 0 0 1 .616-.002c.052.017.15.061.358.235.216.181.48.44.888.843l.613.604a1 1 0 0 0 1.409-.005l3.5-3.5a1 1 0 1 0-1.414-1.414l-2.798 2.798a16.51 16.51 0 0 0-.914-.86c-.303-.253-.631-.477-1.034-.606a3 3 0 0 0-1.846.007c-.401.131-.728.358-1.029.613-.285.242-.604.562-.975.932l-.027.027L5.3 20.38c-.19-.577-.3-1.402-.3-3.07v-6.617c0-2.335.212-3.019.565-3.68a3.466 3.466 0 0 1 1.448-1.447C7.673 5.212 8.357 5 10.692 5h6.616c2.335 0 3.019.212 3.68.565a3.466 3.466 0 0 1 1.447 1.448c.353.66.565 1.344.565 3.679V13a1 1 0 1 0 2 0v-2.308c0-2.448-.216-3.527-.801-4.623a5.465 5.465 0 0 0-2.269-2.268C20.835 3.216 19.756 3 17.308 3h-6.616Zm-.192 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14.499 4.293a1.001 1.001 0 0 0-1.416 0l-.708.708 2.124 2.124.708-.708a1.001 1.001 0 0 0 0-1.416l-.708-.708Zm-.98 3.812-2.125-2.124-4.338 4.338c-.44.44-.77.976-.967 1.566l-.573 1.72a.3.3 0 0 0 .38.38l1.719-.574a4.005 4.005 0 0 0 1.565-.968l4.338-4.338Z" clip-rule="evenodd"/></svg>',
  shapes: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 28 28"><path fill="currentColor" fill-rule="evenodd" d="M15.4 5h-2.8c-1.7132 0-2.8777.0016-3.778.0751-.8768.0716-1.3252.2015-1.638.3609a4 4 0 0 0-1.748 1.748c-.1594.3128-.2893.7612-.3609 1.638C5.0016 9.7224 5 10.8869 5 12.6v2.8c0 1.7132.0016 2.8777.0751 3.7779.0716.8769.2015 1.3253.3609 1.6381a4.0002 4.0002 0 0 0 1.748 1.748c.3128.1594.7612.2893 1.638.3609.9003.0735 2.0648.0751 3.778.0751h2.8c1.7132 0 2.8777-.0016 3.7779-.0751.8769-.0716 1.3253-.2015 1.6381-.3609a4.0003 4.0003 0 0 0 1.748-1.748c.1594-.3128.2893-.7612.3609-1.6381.0735-.9002.0751-2.0647.0751-3.7779v-2.8c0-1.7132-.0016-2.8777-.0751-3.778-.0716-.8768-.2015-1.3252-.3609-1.638a4.0002 4.0002 0 0 0-1.748-1.748c-.3128-.1594-.7612-.2893-1.6381-.3609C18.2777 5.0016 17.1132 5 15.4 5ZM3.654 6.276C3 7.5596 3 9.2398 3 12.6v2.8c0 3.3603 0 5.0405.654 6.3239a5.9996 5.9996 0 0 0 2.622 2.6221C7.5596 25 9.2398 25 12.6 25h2.8c3.3603 0 5.0405 0 6.3239-.654a5.9993 5.9993 0 0 0 2.6221-2.6221C25 20.4405 25 18.7603 25 15.4v-2.8c0-3.3603 0-5.0405-.654-6.324a5.9996 5.9996 0 0 0-2.6221-2.622C20.4405 3 18.7603 3 15.4 3h-2.8c-3.3603 0-5.0405 0-6.324.654a6 6 0 0 0-2.622 2.622Z" clip-rule="evenodd"/><path fill="currentColor" d="M8 10c0-.6904.5596-1.25 1.25-1.25s1.25.5596 1.25 1.25-.5596 1.25-1.25 1.25S8 10.6904 8 10Zm4 0c0-.5523.4477-1 1-1h6c.5523 0 1 .4477 1 1s-.4477 1-1 1h-6c-.5523 0-1-.4477-1-1Zm-4 8c0-.6904.5596-1.25 1.25-1.25s1.25.5596 1.25 1.25-.5596 1.25-1.25 1.25S8 18.6904 8 18Zm4 0c0-.5523.4477-1 1-1h3c.5523 0 1 .4477 1 1s-.4477 1-1 1h-3c-.5523 0-1-.4477-1-1Zm-4-4c0-.6904.5596-1.25 1.25-1.25s1.25.5596 1.25 1.25-.5596 1.25-1.25 1.25S8 14.6904 8 14Zm4 0c0-.5523.4477-1 1-1h6c.5523 0 1 .4477 1 1s-.4477 1-1 1h-6c-.5523 0-1-.4477-1-1Z"/></svg>',
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 16l3-8 3 8"/><line x1="10" y1="13" x2="14" y2="13"/></svg>',
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 28 28"><path fill-rule="evenodd" d="M7.96 3h12.08c.666 0 1.226 0 1.683.037.48.04.934.124 1.366.344a3.5 3.5 0 0 1 1.53 1.53c.22.432.305.887.344 1.366C25 6.734 25 7.294 25 7.96v.08c0 .666 0 1.226-.037 1.683-.04.48-.124.934-.345 1.366a3.5 3.5 0 0 1-1.529 1.53c-.432.22-.887.305-1.366.344-.457.037-1.017.037-1.683.037H7.96c-.666 0-1.226 0-1.683-.037-.48-.04-.934-.124-1.366-.345a3.5 3.5 0 0 1-1.53-1.529c-.22-.432-.304-.887-.344-1.366C3 9.266 3 8.706 3 8.04v-.08c0-.666 0-1.226.037-1.683.04-.48.124-.934.344-1.366a3.5 3.5 0 0 1 1.53-1.53c.432-.22.887-.304 1.366-.344C6.734 3 7.294 3 7.96 3ZM6.44 5.03c-.356.03-.518.081-.621.133a1.5 1.5 0 0 0-.656.656c-.052.103-.103.265-.132.62C5 6.806 5 7.283 5 8s0 1.194.03 1.56c.03.356.081.518.133.621a1.5 1.5 0 0 0 .656.655c.103.053.265.104.62.133C6.806 11 7.283 11 8 11h12c.717 0 1.194 0 1.56-.03.356-.03.518-.081.621-.134a1.5 1.5 0 0 0 .655-.655c.053-.103.104-.265.133-.62C23 9.194 23 8.717 23 8s0-1.194-.03-1.56c-.03-.356-.081-.518-.133-.621a1.5 1.5 0 0 0-.656-.656c-.103-.052-.265-.103-.62-.132C21.194 5 20.717 5 20 5H8c-.717 0-1.194 0-1.56.03ZM7.96 15h.08c.666 0 1.226 0 1.683.037.48.04.934.124 1.366.345a3.5 3.5 0 0 1 1.53 1.529c.22.432.305.887.344 1.366.037.457.037 1.017.037 1.683v.08c0 .666 0 1.226-.037 1.683-.04.48-.124.934-.345 1.366a3.5 3.5 0 0 1-1.529 1.53c-.432.22-.887.305-1.366.344C9.266 25 8.706 25 8.04 25h-.08c-.666 0-1.226 0-1.683-.037-.48-.04-.934-.124-1.366-.345a3.5 3.5 0 0 1-1.53-1.529c-.22-.432-.304-.887-.344-1.366C3 21.266 3 20.706 3 20.04v-.08c0-.666 0-1.226.037-1.683.04-.48.124-.934.344-1.366a3.5 3.5 0 0 1 1.53-1.53c.432-.22.887-.305 1.366-.344C6.734 15 7.294 15 7.96 15Zm-1.52 2.03c-.356.03-.518.081-.621.133a1.5 1.5 0 0 0-.656.656c-.052.103-.103.265-.132.62C5 18.806 5 19.283 5 20s0 1.194.03 1.56c.03.356.081.518.133.621a1.5 1.5 0 0 0 .656.655c.103.053.265.104.62.133C6.806 23 7.283 23 8 23s1.194 0 1.56-.03c.356-.03.518-.081.621-.133a1.5 1.5 0 0 0 .655-.656c.053-.103.104-.265.133-.62C11 21.194 11 20.717 11 20s0-1.194-.03-1.56c-.03-.356-.081-.518-.134-.621a1.5 1.5 0 0 0-.655-.655c-.103-.053-.265-.104-.62-.133C9.194 17 8.717 17 8 17s-1.194 0-1.56.03ZM19.96 15c-.666 0-1.226 0-1.683.037-.48.04-.934.124-1.366.345a3.5 3.5 0 0 0-1.53 1.529c-.22.432-.305.887-.344 1.366C15 18.734 15 19.294 15 19.96v.08c0 .666 0 1.226.037 1.683.04.48.124.934.345 1.366a3.5 3.5 0 0 0 1.529 1.53c.432.22.887.305 1.366.344.457.037 1.017.037 1.683.037h.08c.666 0 1.226 0 1.683-.037.48-.04.934-.124 1.366-.345a3.5 3.5 0 0 0 1.53-1.529c.22-.432.305-.887.344-1.366.037-.457.037-1.017.037-1.683v-.08c0-.666 0-1.226-.037-1.683-.04-.48-.124-.934-.345-1.366a3.5 3.5 0 0 0-1.529-1.53c-.432-.22-.887-.305-1.366-.344C21.266 15 20.706 15 20.04 15h-.08Zm-2.141 2.163c.103-.052.265-.103.62-.132C18.806 17 19.283 17 20 17s1.194 0 1.56.03c.356.03.518.081.621.133a1.5 1.5 0 0 1 .655.656c.053.103.104.265.133.62.03.367.031.844.031 1.561s0 1.194-.03 1.56c-.03.356-.081.518-.133.621a1.5 1.5 0 0 1-.656.655c-.103.053-.265.104-.62.133C21.194 23 20.717 23 20 23s-1.194 0-1.56-.03c-.356-.03-.518-.081-.621-.133a1.5 1.5 0 0 1-.655-.656c-.053-.103-.104-.265-.133-.62C17 21.194 17 20.717 17 20s0-1.194.03-1.56c.03-.356.081-.518.133-.621a1.5 1.5 0 0 1 .656-.655Z" clip-rule="evenodd"/></svg>',
  ai: '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M19.8506 34.7139C19.8505 35.4238 19.2753 35.9998 18.5654 36C17.8555 35.9998 17.2793 35.4238 17.2793 34.7139V29.041H19.8506V34.7139ZM14.0918 32.5527C14.0918 33.2625 13.5163 33.8384 12.8066 33.8389C12.0966 33.8389 11.5205 33.2628 11.5205 32.5527V29.041H14.0918V32.5527ZM24.8916 32.5527C24.8916 33.2625 24.3161 33.8384 23.6064 33.8389C22.8964 33.8389 22.3203 33.2628 22.3203 32.5527V29.041H24.8662C24.8747 29.041 24.8831 29.0401 24.8916 29.04V32.5527ZM31.834 23.04C32.5438 23.0403 33.12 23.6164 33.1201 24.3262C33.1199 25.0359 32.5437 25.6111 31.834 25.6113H28.9766C29.0206 25.3682 29.0449 25.1181 29.0449 24.8623V23.04H31.834ZM6.95703 24.8623C6.95703 25.1181 6.98139 25.3682 7.02539 25.6113H3.44629C2.73636 25.6113 2.1604 25.036 2.16016 24.3262C2.1603 23.6162 2.7363 23.04 3.44629 23.04H6.95703V24.8623ZM34.7139 17.2793C35.4238 17.2793 35.9998 17.8555 36 18.5654C35.9998 19.2753 35.4238 19.8506 34.7139 19.8506H29.0449V17.2793H34.7139ZM6.95703 19.8506H1.28613C0.576229 19.8506 0.000245737 19.2753 0 18.5654C0.00017429 17.8555 0.576184 17.2793 1.28613 17.2793H6.95703V19.8506ZM31.834 12.2383C32.5439 12.2385 33.1201 12.8145 33.1201 13.5244C33.1198 14.2341 32.5436 14.8093 31.834 14.8096H29.0449V12.2383H31.834ZM6.95703 14.8096H3.44629C2.73642 14.8096 2.1605 14.2342 2.16016 13.5244C2.16016 12.8143 2.73621 12.2383 3.44629 12.2383H6.95703V14.8096ZM23.6064 2.87891C24.3161 2.87936 24.8915 3.45533 24.8916 4.16504V6.95312H22.3203V4.16504C22.3204 3.45505 22.8964 2.87891 23.6064 2.87891ZM12.8066 2.87891C13.5163 2.87935 14.0917 3.45532 14.0918 4.16504V6.95312H11.5205V4.16504C11.5206 3.45505 12.0966 2.87891 12.8066 2.87891ZM18.5654 0C19.2753 0.000245711 19.8506 0.576204 19.8506 1.28613V6.95312H17.2793V1.28613C17.2793 0.57616 17.8555 0.000174338 18.5654 0Z" fill="currentColor"/><rect x="7.91992" y="7.9165" width="20.16" height="20.16" rx="3.21429" stroke="currentColor" stroke-width="2.57143"/><path d="M15.4795 13.1104C17.9512 13.1105 20.0047 15.1121 20.0049 17.6104V21.5967C20.0046 22.3063 19.4294 22.8816 18.7197 22.8818C18.01 22.8817 17.4339 22.3064 17.4336 21.5967V20.1572H13.5254V21.5967C13.5251 22.3065 12.9491 22.8818 12.2393 22.8818C11.5295 22.8817 10.9534 22.3064 10.9531 21.5967V17.6104C10.9534 15.1121 13.0078 13.1105 15.4795 13.1104ZM23.6055 13.3164C24.3152 13.3168 24.8906 13.8927 24.8906 14.6025V21.3906C24.8905 22.1003 24.3151 22.6763 23.6055 22.6768C22.8955 22.6768 22.3195 22.1006 22.3193 21.3906V14.6025C22.3193 13.8925 22.8954 13.3164 23.6055 13.3164ZM15.4795 15.6826C14.4095 15.6828 13.5398 16.5451 13.5264 17.5859H17.4326C17.4192 16.5451 16.5495 15.6827 15.4795 15.6826Z" fill="currentColor"/></g></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 5 4 6 5 8-1 2-5 3-5 8M17 3c0 5-4 6-5 8 1 2 5 3 5 8"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2" fill="currentColor" stroke="none"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9"/></svg>',
  circleSlash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="5" y1="19" x2="19" y2="5"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="9" rx="4.5"/><line x1="6" y1="12.5" x2="10" y2="12.5"/><line x1="8" y1="10.5" x2="8" y2="14.5"/><circle cx="15" cy="11.5" r="1"/><circle cx="18" cy="13.5" r="1"/></svg>',
  vk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 0 1-1-7.9 5 5 0 0 1 9.6-2A4.5 4.5 0 0 1 17 18H7z"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.7 7.7 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9c.8.7 1.6 1.2 2.6 1.5l.5 2.5h4l.5-2.5a7.6 7.6 0 0 0 2.6-1.5l2.3.9 2-3.4z"/></svg>',
  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="9" y1="22" x2="15" y2="22"/></svg>',
  folderIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>',
  fileGlyph: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="7.5" y1="8" x2="16.5" y2="8"/><line x1="7.5" y1="12" x2="16.5" y2="12"/><line x1="7.5" y1="16" x2="13" y2="16"/></svg>',
  sort: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.5 2.5a.75.75 0 0 1 .75.75v7.69l.97-.97a.75.75 0 0 1 1.06 1.06l-2.25 2.25a.755.755 0 0 1-.518.22h-.024a.745.745 0 0 1-.518-.22l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V3.25a.75.75 0 0 1 .75-.75Zm7 11a.75.75 0 0 1-.75-.75V5.06l-.97.97a.75.75 0 0 1-1.06-1.06l2.247-2.248a.717.717 0 0 1 .165-.126.747.747 0 0 1 .9.126L14.28 4.97a.75.75 0 0 1-1.06 1.06l-.97-.97v7.69a.75.75 0 0 1-.75.75Z" clip-rule="evenodd"/></svg>',
  viewList: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M6.667 4.917a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75Zm0 5.083a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75Zm0 5.083a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75ZM5 10a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 10Zm0 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 15ZM5 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 5Z"/></svg>',
  viewGrid: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.121 9c-.395 0-.736 0-1.017-.023a2.3 2.3 0 0 1-.875-.222 2.25 2.25 0 0 1-.984-.984 2.3 2.3 0 0 1-.222-.875C11 6.616 11 6.246 11 5.85v-.7c0-.395 0-.765.023-1.046a2.3 2.3 0 0 1 .222-.875 2.25 2.25 0 0 1 .984-.984 2.3 2.3 0 0 1 .875-.222C13.384 2 13.726 2 14.12 2h.758c.395 0 .736 0 1.017.023.297.024.592.078.875.222.424.216.768.56.984.984.144.283.198.578.222.875.023.28.023.65.023 1.046v.7c0 .395 0 .765-.023 1.046a2.3 2.3 0 0 1-.222.875 2.25 2.25 0 0 1-.983.984c-.284.144-.58.198-.876.222C15.616 9 15.274 9 14.88 9zM16.5 5.15v.7c0 .432 0 .712-.018.924-.017.204-.045.28-.064.316a.75.75 0 0 1-.328.328c-.037.02-.112.047-.316.064-.212.017-.492.018-.924.018h-.7c-.432 0-.712 0-.924-.018-.204-.017-.28-.045-.317-.064a.75.75 0 0 1-.327-.328c-.02-.037-.047-.112-.064-.316a13 13 0 0 1-.018-.924v-.7c0-.432 0-.712.018-.924.017-.204.045-.28.064-.316a.75.75 0 0 1 .327-.328c.038-.02.113-.047.317-.064.212-.017.492-.018.924-.018h.7c.432 0 .712 0 .924.018.204.017.28.045.316.064a.75.75 0 0 1 .328.328c.02.037.047.112.064.316.017.212.018.492.018.924M11 14.121c0-.395 0-.736.023-1.017a2.3 2.3 0 0 1 .222-.875 2.25 2.25 0 0 1 .984-.984 2.3 2.3 0 0 1 .875-.222c.28-.023.65-.023 1.046-.023h.7c.395 0 .765 0 1.046.023.297.024.592.078.875.222.424.216.768.56.984.984.144.283.198.578.222.875.023.28.023.622.023 1.017v.758c0 .395 0 .736-.023 1.017a2.3 2.3 0 0 1-.222.875 2.25 2.25 0 0 1-.983.984c-.284.144-.58.198-.876.222-.28.023-.65.023-1.046.023h-.7c-.395 0-.765 0-1.046-.023a2.3 2.3 0 0 1-.875-.222 2.25 2.25 0 0 1-.984-.983 2.3 2.3 0 0 1-.222-.876C11 15.616 11 15.274 11 14.88zm3.85 2.379h-.7c-.432 0-.712 0-.924-.018-.204-.017-.28-.045-.317-.064a.75.75 0 0 1-.327-.328c-.02-.037-.047-.112-.064-.316a13 13 0 0 1-.018-.924v-.7c0-.432 0-.712.018-.924.017-.204.045-.28.064-.317a.75.75 0 0 1 .327-.327c.038-.02.113-.047.317-.064.212-.017.492-.018.924-.018h.7c.432 0 .712 0 .924.018.204.017.28.045.316.064a.75.75 0 0 1 .328.327c.02.038.047.113.064.317.017.212.018.492.018.924v.7c0 .432 0 .712-.018.924-.017.204-.045.28-.064.316a.75.75 0 0 1-.328.328c-.037.02-.112.047-.316.064-.212.017-.492.018-.924.018M2 5.121v.758c0 .395 0 .736.023 1.017.024.297.078.592.222.875.216.424.56.768.984.984.283.144.578.198.875.222C4.384 9 4.754 9 5.15 9h.7c.395 0 .765 0 1.046-.023a2.3 2.3 0 0 0 .875-.222 2.25 2.25 0 0 0 .984-.984 2.3 2.3 0 0 0 .222-.875C9 6.616 9 6.274 9 5.88v-.76c0-.395 0-.736-.023-1.017a2.3 2.3 0 0 0-.222-.875 2.25 2.25 0 0 0-.984-.984 2.3 2.3 0 0 0-.875-.222C6.616 2 6.246 2 5.85 2h-.7c-.395 0-.765 0-1.046.023a2.3 2.3 0 0 0-.875.222 2.25 2.25 0 0 0-.984.984 2.3 2.3 0 0 0-.222.875C2 4.384 2 4.726 2 5.12M5.5 7.5h.35c.432 0 .712 0 .924-.018.204-.017.28-.045.316-.064a.75.75 0 0 0 .328-.328c.02-.037.047-.112.064-.316.017-.212.018-.492.018-.924v-.7c0-.432 0-.712-.018-.924-.017-.204-.045-.28-.064-.316a.75.75 0 0 0-.328-.328c-.037-.02-.112-.047-.316-.064A13 13 0 0 0 5.85 3.5h-.7c-.432 0-.712 0-.924.018-.204.017-.28.045-.316.064a.75.75 0 0 0-.328.328c-.02.037-.047.112-.064.316-.017.212-.018.492-.018.924v.7c0 .432 0 .712.018.924.017.204.045.28.064.316a.75.75 0 0 0 .328.328c.037.02.112.047.316.064.212.017.492.018.924.018zM2 14.121c0-.395 0-.736.023-1.017a2.3 2.3 0 0 1 .222-.875 2.25 2.25 0 0 1 .984-.984 2.3 2.3 0 0 1 .875-.222C4.384 11 4.754 11 5.15 11h.7c.395 0 .765 0 1.046.023.297.024.592.078.875.222.424.216.768.56.984.984.144.283.198.578.222.875.023.28.023.622.023 1.017v.758c0 .395 0 .736-.023 1.017a2.3 2.3 0 0 1-.222.875 2.25 2.25 0 0 1-.984.984 2.3 2.3 0 0 1-.875.222C6.616 18 6.246 18 5.85 18h-.7c-.395 0-.765 0-1.046-.023a2.3 2.3 0 0 1-.875-.222 2.25 2.25 0 0 1-.984-.983 2.3 2.3 0 0 1-.222-.876C2 15.616 2 15.274 2 14.88zM5.85 16.5h-.7c-.432 0-.712 0-.924-.018-.204-.017-.28-.045-.316-.064a.75.75 0 0 1-.328-.328c-.02-.037-.047-.112-.064-.316a13 13 0 0 1-.018-.924v-.7c0-.432 0-.712.018-.924.017-.204.045-.28.064-.317a.75.75 0 0 1 .328-.327c.037-.02.112-.047.316-.064.212-.017.492-.018.924-.018h.7c.432 0 .712 0 .924.018.204.017.28.045.316.064a.75.75 0 0 1 .328.327c.02.038.047.113.064.317.017.212.018.492.018.924v.7c0 .432 0 .712-.018.924-.017.204-.045.28-.064.316a.75.75 0 0 1-.328.328c-.037.02-.112.047-.316.064-.212.017-.492.018-.924.018" clip-rule="evenodd"/></svg>',
  download: '<svg fill="none" height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m20.7071 8.29289c.3905.39053.3905 1.02369 0 1.41422-.3905.39049-1.0237.39049-1.4142 0l-4.2929-4.2929v11.58579c0 .5523-.4477 1-1 1s-1-.4477-1-1v-11.58579l-4.29289 4.2929c-.39053.39049-1.02369.39049-1.41422 0-.39052-.39053-.39052-1.02369 0-1.41422l5.99991-5.99986.0001-.00014c.1945-.1945.4492-.29213.7041-.29289h.003.003c.1345.0004.2627.02735.3798.07588.1162.04807.2251.11899.32.21276m6.0043 6.00425-5.9995-5.99947zm-16.7071 9.34991v-1.6428c0-.5523.44772-1 1-1 .55229 0 1 .4477 1 1v1.6c0 1.1366.00078 1.9289.05118 2.5458.04944.6051.14161.9528.2758 1.2162.28762.5645.74656 1.0234 1.31105 1.311.26335.1342.61104.2264 1.21621.2758.61684.0504 1.40916.0512 2.54576.0512h5.2c1.1366 0 1.9289-.0008 2.5458-.0512.6051-.0494.9528-.1416 1.2162-.2758.5645-.2876 1.0234-.7465 1.311-1.311.1342-.2634.2264-.6111.2758-1.2162.0504-.6169.0512-1.4092.0512-2.5458v-1.6c0-.5523.4477-1 1-1s1 .4477 1 1v1.6428.0001c0 1.0838 0 1.9579-.0578 2.6657-.0596.7289-.1854 1.3691-.4872 1.9614-.4793.9408-1.2442 1.7057-2.185 2.185-.5923.3018-1.2325.4276-1.9614.4872-.7078.0578-1.582.0578-2.6657.0578h-.0001-5.2856c-1.0838 0-1.95794 0-2.66582-.0578-.72885-.0596-1.36904-.1854-1.96133-.4872-.94081-.4793-1.70572-1.2442-2.18508-2.185-.30179-.5923-.4276-1.2325-.48715-1.9614-.05784-.7079-.05783-1.582-.05782-2.6658z" fill="currentColor" fill-rule="evenodd"/></svg>',
  avatar: '<svg fill="none" height="56" viewBox="0 0 56 56" width="56" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path clip-rule="evenodd" d="m37.5 24.5c0 5.2484-4.2516 9.5-9.5 9.5s-9.5-4.2516-9.5-9.5 4.2516-9.5 9.5-9.5 9.5 4.2516 9.5 9.5zm-3 0c0-3.5916-2.9084-6.5-6.5-6.5s-6.5 2.9084-6.5 6.5 2.9084 6.5 6.5 6.5 6.5-2.9084 6.5-6.5z" fill-rule="evenodd"/><path d="m28 37.5014c6.4644 0 12.4115 2.232 17.1069 5.9661l-2.25 2.0498c-4.1218-3.1474-9.2693-5.0159-14.8569-5.0159s-10.7351 1.8685-14.8569 5.0159l-2.25-2.0498c4.6954-3.7341 10.6425-5.9661 17.1069-5.9661z"/><path clip-rule="evenodd" d="m52 28c0 13.2548-10.7452 24-24 24s-24-10.7452-24-24 10.7452-24 24-24 24 10.7452 24 24zm-3 0c0 11.598-9.402 21-21 21s-21-9.402-21-21 9.402-21 21-21 21 9.402 21 21z" fill-rule="evenodd"/></g></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  folderPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2.2" fill="var(--surface)"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="15" cy="17" r="2.2" fill="var(--surface)"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><polyline points="10 6 4 12 10 18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>',
  downloadSimple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><polyline points="7 11 12 16 17 11"/><path d="M5 19h14"/></svg>'
};

const SIDEBAR_ITEMS = [
  { kind: 'favorites', label: 'Избранное', icon: ICONS.heart1 },
  { kind: 'presentations', label: 'Презентации', icon: ICONS.presentation },
  { kind: 'photos', label: 'Фотографии', icon: ICONS.camera },
  { kind: 'illustrations', label: 'Иллюстрации', icon: ICONS.image },
  { kind: 'icons', label: 'Иконки', icon: ICONS.shapes },
  { kind: 'logos', label: 'Логотипы', icon: ICONS.logo },
  { kind: 'templates', label: 'Шаблоны', icon: ICONS.template },
];
const AI_NAV_ITEM = { kind: 'ai', label: 'ИИ-ассистент', icon: ICONS.ai };

const DECK_SECTIONS = ['presentations', 'favorites', 'templates'];
const TILE_SECTIONS = ['photos', 'illustrations', 'icons', 'logos'];

const SECTION_LABELS = {
  favorites: 'Выберите макет для вашего слайда',
  presentations: 'Выберите макет для вашего слайда',
  photos: 'Выберите фотографию для вашего слайда',
  illustrations: 'Выберите изображение для вашего слайда',
  icons: 'Выберите иконку для вашего слайда',
  logos: 'Выберите логотип для вашего слайда',
  templates: 'Выберите макет для вашего слайда',
};

const PRODUCT_OPTIONS = ['Все', 'MAX', 'VK'];
const TAG_TAXONOMY = {
  contentType: ['Презентации', 'Шаблон', 'Таблицы', 'Схемы', 'Диаграммы', 'QR-коды', 'Иллюстрации', 'Фото', 'Иконки', '3D-элементы', 'Опрос/голосование', 'Видео', 'Карты', 'Roadmap'],
  product: ['VK Видео', 'VK Музыка', 'VK tech', 'Маркетинг', 'All hands', 'Сферум', 'MAX'],
  format: ['16x9', 'Под телефон', 'A4', 'A3', 'Триптих'],
  theme: ['Минимализм', 'Корпоративный', 'Креативный', 'Нейтральное', 'ТемнаяТема', 'СветлаяТема', 'Градиенты', 'Графичный'],
  sphere: ['Бизнес', 'Образование', 'IT', 'Финансы', 'Маркетинг', 'HR', 'Продажи'],
  audience: ['ДляРуководства', 'ДляКлиентов', 'ДляИнвесторов', 'ДляКоманды', 'ДляКонференции'],
  speechType: ['Отчетный', 'Питч', 'ЗащитаПроекта', 'Мотивационный', 'Образовательный', 'Продающий'],
  structure: ['Введение', 'ПроблемаРешение', 'Кейсы', 'Сравнение', 'Финансы', 'ТитульныйСлайд', 'Оглавление', 'Разделитель', 'Резюме', 'ЗаключительныйСлайд', 'Контакты'],
};
const TAG_SUGGESTIONS_FLAT = [...new Set(Object.values(TAG_TAXONOMY).flat())];
const MAX_TAGS = 25;
const ILLUSTRATION_STYLE_TYPES = ['3D', 'Плоская иллюстрация', 'Паттерн'];

const FOLDER_LABEL_TO_KIND = {};
SIDEBAR_ITEMS.forEach(item => { FOLDER_LABEL_TO_KIND[item.label.toLowerCase()] = item.kind; });
Object.assign(FOLDER_LABEL_TO_KIND, {
  favorites: 'favorites', presentations: 'presentations', photos: 'photos',
  illustrations: 'illustrations', icons: 'icons', logos: 'logos', templates: 'templates',
});

// slides и tiles уже объявлены в начале, поэтому удаляем старые дублирующие строки
// let slides = ... и let tiles = ... удалены

let activeSection = 'presentations';
let activeScope = 'public';
let searchQuery = '';
let sortMode = 'name';
let viewMode = 'list';
let favorites = new Set();
let recentlyUsed = [];
let insertingIds = new Set();
let selectedIds = new Set();
let modalSlideId = null;
let modalKeydownHandler = null; 
let sidebarCollapsed = true;

let cardPreviewIndex = {};
let modalPreviewIndex = 0;

let panelSelectedId = null;
let panelProduct = { photos: 'Все', logos: 'Все', templates: 'Все' };
let panelIconExt = 'Все';
let panelIllustrationType = 'Все';
let showTemplateUploadForm = false;

const FILTER_FACETS = [
  { key: 'contentType', label: 'По типу контента', options: ['Все', ...TAG_TAXONOMY.contentType] },
  { key: 'product', label: 'По продуктам', options: ['Все', ...TAG_TAXONOMY.product] },
  { key: 'sphere', label: 'По сфере', options: ['Все', ...TAG_TAXONOMY.sphere] },
  { key: 'audience', label: 'По аудитории', options: ['Все', ...TAG_TAXONOMY.audience] },
  { key: 'format', label: 'По формату', options: ['Все', ...TAG_TAXONOMY.format] },
  { key: 'structure', label: 'По структуре', options: ['Все', ...TAG_TAXONOMY.structure] },
  { key: 'speechType', label: 'По типу выступления', options: ['Все', ...TAG_TAXONOMY.speechType] },
  { key: 'theme', label: 'По стилю оформления', options: ['Все', ...TAG_TAXONOMY.theme] },
];

const DEFAULT_FILTER_VALUES = {
  contentType: 'Все', product: 'Все', sphere: 'Все', audience: 'Все',
  format: 'Все', structure: 'Все', speechType: 'Все', theme: 'Все',
};

let draftFacetValues = { ...DEFAULT_FILTER_VALUES };
let draftAiOnly = false;
let appliedFacetValues = { ...DEFAULT_FILTER_VALUES };
let appliedAiOnly = false;

const $mainView = document.getElementById('mainView');
const $filtersView = document.getElementById('filtersView');
const $cabinetView = document.getElementById('cabinetView');
const $sidebar = document.getElementById('sidebar');
const $scopeTabs = document.getElementById('scopeTabs');
const $grid = document.getElementById('slideGrid');
const $recentGrid = document.getElementById('recentGrid');
const $recentSection = document.getElementById('recentSection');
const $search = document.getElementById('searchInput');
const $countLabel = document.getElementById('countLabel');
const $status = document.getElementById('status');
const $modal = document.getElementById('modal');
const $modalTitle = document.getElementById('modalTitle');
const $modalPreview = document.getElementById('modalPreview');
const $modalPreviewImg = document.getElementById('modalPreviewImg');
const $modalDots = document.getElementById('modalDots');
const $modalMeta = document.getElementById('modalMeta');
const $modalInsert = document.getElementById('modalInsert');
const $modalClose = document.getElementById('modalClose');
const $exportBtn = document.getElementById('exportBtn');
const $sortBtn = document.getElementById('sortBtn');
const $modalVersions = document.getElementById('modalVersions');
const $versionsList = document.getElementById('versionsList');
const $filterBtn = document.getElementById('filterBtn');
const $filtersBody = document.getElementById('filtersBody');
const $clearFiltersBtn = document.getElementById('clearFiltersBtn');
const $closeFiltersBtn = document.getElementById('closeFiltersBtn');
const $applyFiltersBtn = document.getElementById('applyFiltersBtn');
const $viewToggleBtn = document.getElementById('viewToggleBtn');
const $cancelBtn = document.getElementById('cancelBtn');
const $footerInsertBtn = document.getElementById('footerInsertBtn');
const $addToLibraryBtn = document.getElementById('addToLibraryBtn');
const $closeBtn = document.getElementById('closeBtn');
const $categoryHeader = document.getElementById('categoryHeader');
const $avatarBtn = document.getElementById('avatarBtn');
const $cabinetBackBtn = document.getElementById('cabinetBackBtn');
const $closeCabinetBtn = document.getElementById('closeCabinetBtn');
const $cabinetCancelBtn = document.getElementById('cabinetCancelBtn');
const $cabinetSaveBtn = document.getElementById('cabinetSaveBtn');
const $cabinetFolderBtn = document.getElementById('cabinetFolderBtn');
const $cabinetFolderLabel = document.getElementById('cabinetFolderLabel');
const $downloadLibraryBtn = document.getElementById('downloadLibraryBtn');
const $downloadSuggestionsBtn = document.getElementById('downloadSuggestionsBtn');
const $folderImportInput = document.getElementById('folderImportInput');

const storageImpl = (typeof OfficeRuntime !== 'undefined' && OfficeRuntime.storage) 
    ? {
        getItem: (key) => OfficeRuntime.storage.getItem(key),
        setItem: (key, value) => OfficeRuntime.storage.setItem(key, value),
        removeItem: (key) => OfficeRuntime.storage.removeItem(key)
      }
    : (typeof window !== 'undefined' && window.localStorage)
    ? {
        getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key))
      }
    : null;

const hasStorage = !!storageImpl;

async function loadFromStorage() {
  if (!hasStorage) return;
  try {
    const favsRaw = await storageImpl.getItem('sl_favorites');
    if (favsRaw) JSON.parse(favsRaw).forEach(id => favorites.add(id));
    const recRaw = await storageImpl.getItem('sl_recent');
    if (recRaw) recentlyUsed = JSON.parse(recRaw).slice(0, 3);
  } catch (e) {
    console.warn('[Slidebrary] Storage error:', e);
  }
}

async function persistFavorites() {
  if (!hasStorage) return;
  try {
    await storageImpl.setItem('sl_favorites', JSON.stringify([...favorites]));
  } catch (e) {
    console.warn('[Slidebrary] Storage write error:', e);
  }
}

async function addToRecent(id) {
  recentlyUsed = [id, ...recentlyUsed.filter(x => x !== id)].slice(0, 3);
  if (!hasStorage) return;
  try {
    await storageImpl.setItem('sl_recent', JSON.stringify(recentlyUsed));
  } catch (e) {
    console.warn('[Slidebrary] Storage write error:', e);
  }
}

function facetMatches(item, key, value) {
  const isAny = value === 'Все';
  if (isAny) return true;
  if (item[key] !== undefined) return item[key] === value;
  const haystack = [item.category, ...(item.tags || [])]
    .filter(Boolean)
    .map(v => v.toLowerCase());
  return haystack.includes(value.toLowerCase());
}

const pptxPageCache = {};
const pptxParseInFlight = {};

function looksLikePptxFile(fileSource) {
  if (!fileSource) return false;
  if (typeof fileSource === 'string') return /\.pptx?(\?.*)?$/i.test(fileSource) || fileSource.startsWith('data:application/vnd.openxmlformats-officedocument.presentationml');
  if (fileSource instanceof File) return /\.pptx?$/i.test(fileSource.name);
  return false;
}

function shouldAutoParsePptx(item) {
  return !(item.slides && item.slides.length) && !(item.previews && item.previews.length) && looksLikePptxFile(item.file);
}

async function fileSourceToArrayBuffer(fileSource) {
  if (fileSource instanceof File || fileSource instanceof Blob) {
    return await fileSource.arrayBuffer();
  }
  if (typeof fileSource === 'string' && fileSource.startsWith('data:')) {
    const base64 = fileSource.split(',')[1] || '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
  const url = fileSource.startsWith('http') ? fileSource : (window.location.origin + '/' + fileSource);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Файл не найден: ' + url);
  return await res.arrayBuffer();
}

async function parsePptxDeck(item) {
  if (pptxPageCache[item.id]) return pptxPageCache[item.id];
  if (pptxParseInFlight[item.id]) return pptxParseInFlight[item.id];
  if (typeof JSZip === 'undefined') return null;

  const task = (async () => {
    try {
      const buf = await fileSourceToArrayBuffer(item.file);
      const zip = await JSZip.loadAsync(buf);
      const slideFiles = Object.keys(zip.files)
        .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
        .sort((a, b) => {
          const na = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
          const nb = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
          return na - nb;
        });
      if (!slideFiles.length) return null;

      const pages = [];
      for (let i = 0; i < slideFiles.length; i++) {
        const xml = await zip.file(slideFiles[i]).async('string');
        const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]).filter(Boolean);
        const title = texts[0] || null;
        pages.push({
          name: title || `Слайд ${i + 1}`,
          file: item.file,
          preview: i === 0 ? (item.preview || null) : null,
          autoTitle: title,
          autoIndex: i + 1,
        });
      }
      pptxPageCache[item.id] = pages;
      return pages;
    } catch (err) {
      console.warn('[Slidebrary] pptx parse failed for', item.id, err);
      return null;
    } finally {
      delete pptxParseInFlight[item.id];
    }
  })();

  pptxParseInFlight[item.id] = task;
  return task;
}

function ensurePptxPagesParsed(item, onReady) {
  if (pptxPageCache[item.id]) { onReady(pptxPageCache[item.id]); return; }
  if (!shouldAutoParsePptx(item)) return;
  parsePptxDeck(item).then(pages => {
    if (pages && pages.length > 1) onReady(pages);
  });
}

function getDeckPages(item) {
  if (pptxPageCache[item.id]) return pptxPageCache[item.id];
  if (item.slides && item.slides.length) {
    return item.slides.map(s => ({ preview: s.preview || null, file: s.file || item.file }));
  }
  if (item.previews && item.previews.length) {
    return item.previews.map(p => ({ preview: p, file: item.file }));
  }
  if (item.preview || item.file) {
    return [{ preview: item.preview || null, file: item.file }];
  }
  return [{ preview: null, file: item.file }];
}

function getActiveFile(item) {
  const pages = getDeckPages(item);
  const idx = Math.min(cardPreviewIndex[item.id] || 0, pages.length - 1);
  return (pages[idx] && pages[idx].file) || item.file;
}

function getDeckSlides(section) {
  const q = searchQuery.toLowerCase().trim();
  let items = slides.filter(s => {
    const scope = s.scope || 'public';
    if (scope !== activeScope) return false;
    if (s.kind && s.kind !== section) return false;
    if (q) {
      const haystack = [s.name, s.category, ...(s.tags || [])].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (!Object.entries(appliedFacetValues).every(([key, value]) => facetMatches(s, key, value))) return false;
    if (appliedAiOnly && s.aiGenerated !== true) return false;
    return true;
  });
  if (section === 'favorites') {
    items = items.filter(s => favorites.has(s.id));
  }
  const sortFns = {
    name: (a, b) => a.name.localeCompare(b.name, 'ru'),
    date: (a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''),
  };
  return items.sort(sortFns[sortMode] || sortFns.name);
}

function getTileItems(kind) {
  const q = searchQuery.toLowerCase().trim();
  return tiles.filter(t => {
    if (t.kind !== kind) return false;
    const scope = t.scope || 'public';
    if (scope !== activeScope) return false;
    if (q) {
      const haystack = [t.name, t.category].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if ((kind === 'photos' || kind === 'logos') && t.product && panelProduct[kind] !== 'Все' && t.product !== panelProduct[kind]) return false;
    if (kind === 'icons' && t.format && panelIconExt !== 'Все' && t.format !== panelIconExt) return false;
    if (kind === 'illustrations' && t.styleType && panelIllustrationType !== 'Все' && t.styleType !== panelIllustrationType) return false;
    if (!Object.entries(appliedFacetValues).every(([key, value]) => facetMatches(t, key, value))) return false;
    return true;
  });
}

function renderSidebar() {
  $sidebar.className = 'sidebar ' + (sidebarCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded');

  const allItems = [...SIDEBAR_ITEMS, AI_NAV_ITEM];
  const toggleIcon = sidebarCollapsed ? ICONS.back1 : ICONS.back2;
  const toggleLabel = sidebarCollapsed ? 'Развернуть' : 'Свернуть';

  let html = `
    <button class="side-toggle" id="sideToggleBtn" aria-label="${toggleLabel}">${toggleIcon}</button>
    <div class="side-list">
  `;

  allItems.forEach((item, index) => {
    const isActive = activeSection === item.kind;
    const activeClass = isActive ? ' side-item--active' : '';
    const label = sidebarCollapsed ? '' : `<span class="side-item__label">${item.label}</span>`;
    html += `
      <button class="side-item${activeClass}" data-kind="${item.kind}" title="${item.label}">
        <span class="side-item__icon">${item.icon}</span>
        ${label}
      </button>
    `;
    if (index < allItems.length - 1) {
      html += `<div class="side-divider"></div>`;
    }
  });

  html += `</div>`;
  $sidebar.innerHTML = html;

  document.getElementById('sideToggleBtn').addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    renderSidebar();
  });

  $sidebar.querySelectorAll('.side-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.kind;
      if (kind === 'ai') {
        openAiView();
        return;
      }
      if (kind === activeSection) return;
      activeSection = kind;
      panelSelectedId = null;
      selectedIds.clear();
      searchQuery = '';
      $search.value = '';
      renderAll();
    });
  });
}

function renderScopeTabs() {
  $scopeTabs.querySelectorAll('.tab-underline').forEach(btn => {
    btn.classList.toggle('tab-underline--active', btn.dataset.scope === activeScope);
  });
}

$scopeTabs.querySelectorAll('.tab-underline').forEach(btn => {
  btn.addEventListener('click', () => {
    activeScope = btn.dataset.scope;
    renderAll();
  });
});

function renderAll() {
  renderSidebar();
  renderScopeTabs();
  renderCategoryHeader();
  renderContent();
  renderRecent();
  updateFooterState();
  updateToolbarIcons();
  updateLibraryButtonVisibility();
}

function createToggleSwitch(initial, onChange) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'switch' + (initial ? ' switch--on' : '');
  btn.setAttribute('role', 'switch');
  btn.setAttribute('aria-checked', String(!!initial));
  const knob = document.createElement('span');
  knob.className = 'switch__knob';
  btn.appendChild(knob);
  let on = !!initial;
  btn.addEventListener('click', () => {
    on = !on;
    btn.classList.toggle('switch--on', on);
    btn.setAttribute('aria-checked', String(on));
    onChange(on);
  });
  return btn;
}

function createDropdown({ options, value, onChange }) {
  const wrap = document.createElement('div');
  wrap.className = 'dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'dropdown__trigger';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'dropdown__value';

  const chevron = document.createElement('span');
  chevron.className = 'dropdown__chevron';
  chevron.innerHTML = ICONS.chevronDown;

  trigger.appendChild(labelSpan);
  trigger.appendChild(chevron);

  const menu = document.createElement('div');
  menu.className = 'dropdown__menu';
  menu.style.display = 'none';

  let current = value;

  function renderOptions() {
    menu.innerHTML = '';
    options.forEach(opt => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'dropdown__option' + (opt === current ? ' dropdown__option--active' : '');
      row.textContent = opt;
      row.addEventListener('click', e => {
        e.stopPropagation();
        current = opt;
        labelSpan.textContent = opt;
        renderOptions();
        closeMenu();
        onChange(opt);
      });
      menu.appendChild(row);
    });
  }

  function outsideHandler(e) {
    if (!wrap.contains(e.target)) closeMenu();
  }

  function openMenu() {
    menu.style.display = 'block';
    wrap.classList.add('dropdown--open');
    document.addEventListener('click', outsideHandler, { capture: true });
  }

  function closeMenu() {
    menu.style.display = 'none';
    wrap.classList.remove('dropdown--open');
    document.removeEventListener('click', outsideHandler, { capture: true });
  }

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    if (menu.style.display === 'none') openMenu(); else closeMenu();
  });

  labelSpan.textContent = current || '';
  renderOptions();
  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  return wrap;
}

function createTagPicker(initialTags) {
  const wrap = document.createElement('div');
  wrap.className = 'tagpicker';

  const countEl = document.createElement('span');
  countEl.className = 'tagpicker__count';

  const header = document.createElement('div');
  header.className = 'tagpicker__header';
  const label = document.createElement('span');
  label.textContent = 'Хештеги';
  header.appendChild(label);
  header.appendChild(countEl);
  wrap.appendChild(header);

  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'tagpicker__chips';
  wrap.appendChild(chipsWrap);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tagpicker__input';
  input.placeholder = 'Новый хештег';
  chipsWrap.appendChild(input);

  const suggestWrap = document.createElement('div');
  suggestWrap.className = 'tagpicker__suggestions';
  wrap.appendChild(suggestWrap);

  let tags = [...(initialTags || [])];

  function renderChips() {
    chipsWrap.querySelectorAll('.tagpicker__chip').forEach(el => el.remove());
    tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tagpicker__chip';
      chip.textContent = tag;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        tags = tags.filter(t => t !== tag);
        renderChips();
        renderSuggestions();
      });
      chip.appendChild(remove);
      chipsWrap.insertBefore(chip, input);
    });
    countEl.textContent = `${tags.length}/${MAX_TAGS}`;
    input.disabled = tags.length >= MAX_TAGS;
  }

  function addTag(raw) {
    const tag = raw.trim();
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    tags.push(tag);
    renderChips();
    renderSuggestions();
  }

  function renderSuggestions() {
    suggestWrap.innerHTML = '';
    TAG_SUGGESTIONS_FLAT.filter(t => !tags.includes(t)).slice(0, 18).forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tagpicker__suggestion';
      btn.textContent = '#' + tag;
      btn.addEventListener('click', () => addTag(tag));
      suggestWrap.appendChild(btn);
    });
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input.value);
      input.value = '';
    }
  });

  renderChips();
  renderSuggestions();

  return { el: wrap, getTags: () => [...tags] };
}

function renderAddFileForm(mount, { full = false, onSubmit, onCancel }) {
  mount.innerHTML = '';
  const form = document.createElement('div');
  form.className = 'upload-form';

  const dropZone = document.createElement('label');
  dropZone.className = 'upload-dropzone';
  dropZone.innerHTML = `
    <span class="upload-dropzone__icon">${ICONS.folderPlus}</span>
    <span class="upload-dropzone__title">Загрузить файл</span>
    <span class="upload-dropzone__hint">Поддерживаемые форматы: pptx, jpg и png. Вес: до 50 МБ.</span>
    <span class="upload-dropzone__filename"></span>
  `;
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pptx,.potx,.jpg,.jpeg,.png';
  fileInput.style.display = 'none';
  dropZone.appendChild(fileInput);
  form.appendChild(dropZone);

  let pickedFile = null;
  const filenameEl = dropZone.querySelector('.upload-dropzone__filename');
  fileInput.addEventListener('change', () => {
    pickedFile = fileInput.files[0] || null;
    filenameEl.textContent = pickedFile ? pickedFile.name : '';
    dropZone.classList.toggle('upload-dropzone--filled', !!pickedFile);
    updateSubmitState();
  });

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'upload-name-input';
  nameInput.placeholder = 'Добавьте название шаблона';
  nameInput.addEventListener('input', updateSubmitState);
  form.appendChild(nameInput);

  const fieldValues = { contentType: 'Презентации' };
  function addField(labelText, key, options) {
    const field = document.createElement('div');
    field.className = 'filter-field';
    const label = document.createElement('label');
    label.className = 'filter-field__label';
    label.textContent = labelText;
    field.appendChild(label);
    fieldValues[key] = options[0];
    const dd = createDropdown({
      options,
      value: options[0],
      onChange: (val) => { fieldValues[key] = val; },
    });
    dd.classList.add('dropdown--filter');
    field.appendChild(dd);
    form.appendChild(field);
  }

  addField('Тип контента', 'contentType', TAG_TAXONOMY.contentType);
  if (full) {
    addField('Продукт', 'product', TAG_TAXONOMY.product);
    addField('Сфера', 'sphere', TAG_TAXONOMY.sphere);
    addField('Формат', 'format', TAG_TAXONOMY.format);
    addField('Структура', 'structure', TAG_TAXONOMY.structure);
    addField('Тип выступления', 'speechType', TAG_TAXONOMY.speechType);
    addField('Стиль оформления', 'theme', TAG_TAXONOMY.theme);
  }

  const tagPicker = createTagPicker([]);
  form.appendChild(tagPicker.el);

  let aiOnly = false;
  if (full) {
    const aiRow = document.createElement('label');
    aiRow.className = 'filter-checkbox-row';
    aiRow.innerHTML = `<input type="checkbox"> ИИ-генерация`;
    aiRow.querySelector('input').addEventListener('change', e => { aiOnly = e.target.checked; });
    form.appendChild(aiRow);
  }

  const actions = document.createElement('div');
  actions.className = 'upload-form__actions';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn--secondary';
  cancelBtn.textContent = 'Отменить';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = 'Добавить';
  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);
  form.appendChild(actions);

  function updateSubmitState() {
    const ready = !!pickedFile && nameInput.value.trim().length > 0;
    submitBtn.classList.toggle('is-active', ready);
    cancelBtn.classList.toggle('is-active', !!pickedFile || nameInput.value.trim().length > 0 || tagPicker.getTags().length > 0);
  }

  cancelBtn.addEventListener('click', () => onCancel && onCancel());
  submitBtn.addEventListener('click', () => {
    if (!pickedFile || !nameInput.value.trim()) return;
    onSubmit({
      file: pickedFile,
      name: nameInput.value.trim(),
      fields: { ...fieldValues },
      tags: tagPicker.getTags(),
      aiGenerated: aiOnly,
    });
  });

  updateSubmitState();
  mount.appendChild(form);
}

function renderCategoryHeader() {
  $countLabel.textContent = SECTION_LABELS[activeSection] || SECTION_LABELS.presentations;
  $exportBtn.style.display = DECK_SECTIONS.includes(activeSection) ? 'flex' : 'none';

  if (activeSection === 'presentations' || activeSection === 'favorites') {
    $categoryHeader.style.display = 'none';
    $categoryHeader.innerHTML = '';
    return;
  }

  $categoryHeader.style.display = 'flex';
  $categoryHeader.innerHTML = '';

  if (activeSection === 'templates') {
    if (activeScope === 'personal') {
      const row = document.createElement('label');
      row.className = 'category-header__row switch-row';
      const span = document.createElement('span');
      span.className = 'category-header__label';
      span.textContent = 'Использовать шаблон / загрузить свой';
      const sw = createToggleSwitch(showTemplateUploadForm, (val) => {
        showTemplateUploadForm = val;
        renderContent();
      });
      row.appendChild(span);
      row.appendChild(sw);
      $categoryHeader.appendChild(row);
    } else {
      const row = document.createElement('div');
      row.className = 'category-header__row';
      const span = document.createElement('span');
      span.className = 'category-header__label';
      span.textContent = 'Выберите продукт';
      const dd = createDropdown({
        options: PRODUCT_OPTIONS,
        value: panelProduct.templates,
        onChange: (val) => { panelProduct.templates = val; renderContent(); },
      });
      dd.classList.add('dropdown--pill');
      row.appendChild(span);
      row.appendChild(dd);
      $categoryHeader.appendChild(row);

      const suggestBtn = document.createElement('button');
      suggestBtn.type = 'button';
      suggestBtn.className = 'suggest-file-btn';
      suggestBtn.innerHTML = `<span class="suggest-file-btn__icon">${ICONS.folderPlus}</span> Предложить файл в базу`;
      suggestBtn.addEventListener('click', openSuggestView);
      $categoryHeader.appendChild(suggestBtn);
    }
  } else if (activeSection === 'photos' || activeSection === 'logos') {
    const label = activeSection === 'photos' ? 'Продукт группы VK' : 'Выберите продукт';
    const row = document.createElement('div');
    row.className = 'category-header__row';
    const span = document.createElement('span');
    span.className = 'category-header__label';
    span.textContent = label;
    row.appendChild(span);
    const dd = createDropdown({
      options: PRODUCT_OPTIONS,
      value: panelProduct[activeSection],
      onChange: (val) => { panelProduct[activeSection] = val; renderContent(); },
    });
    dd.classList.add('dropdown--pill');
    row.appendChild(dd);
    $categoryHeader.appendChild(row);
  } else if (activeSection === 'illustrations') {
    const row = document.createElement('div');
    row.className = 'category-header__row';
    const span = document.createElement('span');
    span.className = 'category-header__label';
    span.textContent = 'Тип изображения';
    row.appendChild(span);
    const dd = createDropdown({
      options: ['Все', ...ILLUSTRATION_STYLE_TYPES],
      value: panelIllustrationType,
      onChange: (val) => { panelIllustrationType = val; renderContent(); },
    });
    dd.classList.add('dropdown--pill');
    row.appendChild(dd);
    $categoryHeader.appendChild(row);
  } else if (activeSection === 'icons') {
    const row = document.createElement('div');
    row.className = 'category-header__inline';
    const span = document.createElement('span');
    span.textContent = 'Расширение файла:';
    row.appendChild(span);
    const dd = createDropdown({
      options: ['Все', 'SVG', 'PNG', 'GIF', 'JPEG'],
      value: panelIconExt,
      onChange: (val) => { panelIconExt = val; renderContent(); },
    });
    dd.classList.add('dropdown--pill', 'dropdown--auto');
    row.appendChild(dd);
    $categoryHeader.appendChild(row);
  }
}

function renderContent() {
  if (activeSection === 'photos') return renderTilePanel('photos');
  if (activeSection === 'illustrations') return renderTilePanel('illustrations');
  if (activeSection === 'icons') return renderTilePanel('icons');
  if (activeSection === 'logos') return renderTilePanel('logos');
  if (activeSection === 'templates') return renderTemplatesPanel();
  return renderGrid();
}

function renderGrid() {
  const items = getDeckSlides(activeSection);
  const isList = viewMode === 'list';
  $grid.className = 'grid' + (isList ? ' grid--list' : '');
  if (!items.length) {
    const emptyText = activeSection === 'favorites'
      ? 'В избранном пока пусто'
      : (activeScope === 'personal' ? 'В личном пока пусто — выберите папку в личном кабинете' : 'Слайды не найдены');
    $grid.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  $grid.innerHTML = '';
  items.forEach(item => $grid.appendChild(buildCard(item, {
    mode: isList ? 'list' : 'grid',
    selected: selectedIds.has(item.id),
    dots: true,
  })));
}

function renderRecent() {
  if (activeSection !== 'presentations') {
    $recentSection.style.display = 'none';
    return;
  }
  const recentItems = recentlyUsed.map(id => slides.find(s => s.id === id)).filter(Boolean);
  if (!recentItems.length) {
    $recentSection.style.display = 'none';
    return;
  }
  $recentSection.style.display = 'block';
  $recentGrid.innerHTML = '';
  recentItems.forEach(item => $recentGrid.appendChild(buildCard(item, {
    mode: 'compact',
    selected: selectedIds.has(item.id),
    dots: false,
  })));
}

function buildCard(item, opts = {}) {
  const {
    mode = 'grid',
    selected = false,
    dots = false,
    onOpen = openModal,
    onToggleFav = toggleFavorite,
    onToggleSelect = toggleSelect,
  } = opts;

  const isFav = favorites.has(item.id);
  const isIns = insertingIds.has(item.id);
  const isList = mode === 'list';
  const color = item.color || '#2688EB';

  const pages = getDeckPages(item);
  const hasMultiPreview = pages.length > 1;
  const activeIdx = hasMultiPreview
    ? Math.min(cardPreviewIndex[item.id] || 0, pages.length - 1)
    : 0;
  const activeImg = pages.length ? pages[activeIdx].preview : null;
  const showDots = !isList && dots && hasMultiPreview;

  const card = document.createElement('div');
  card.className = (mode === 'compact' ? 'card card--compact' : 'card') + (selected ? ' card--selected' : '');

  const thumbHtml = `
    <div class="card__thumb" style="background:${color}18;">
      <div class="card__thumb-inner">
        ${activeImg
      ? `<img src="${activeImg}" alt="${item.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
             <div class="card__thumb-fallback" style="display:none;color:${color};">${ICONS.fileGlyph}</div>`
      : `<div class="card__thumb-fallback" style="color:${color};">${ICONS.fileGlyph}</div>`}
      </div>
      ${!isList ? `
        <button class="fav-btn${isFav ? ' fav-btn--on' : ''}"
                aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
                data-id="${item.id}">${ICONS.heart2}</button>
        <button class="card__btn${isIns ? ' card__btn--loading' : ''}${selected ? ' card__btn--selected' : ''}" data-id="${item.id}" aria-label="Выбрать слайд">
          ${isIns ? '…' : (selected ? ICONS.check : ICONS.plus)}
        </button>
      ` : ''}
    </div>
    ${showDots ? `<div class="card__dots">${pages.map((_, i) =>
      `<span class="card__dot${i === activeIdx ? ' card__dot--active' : ''}" data-index="${i}"></span>`
    ).join('')}</div>` : ''}
  `;

      if (isList) {
    card.innerHTML = `
      ${thumbHtml}
      <div class="card__body"><p class="card__name">${item.name}</p></div>
      <div class="card__actions">
        <button class="fav-btn${isFav ? ' fav-btn--on' : ''}"
                aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
                data-id="${item.id}">${ICONS.heart2}</button>
        <button class="card__btn${isIns ? ' card__btn--loading' : ''}${selected ? ' card__btn--selected' : ''}" data-id="${item.id}" aria-label="Выбрать слайд">
          ${isIns ? '…' : (selected ? ICONS.check : ICONS.plus)}
        </button>
        <!-- КНОПКА ПУБЛИКАЦИИ - СВОЙ КЛАСС card__pub-btn -->
        ${item.scope === 'personal' ? `
          <button class="card__pub-btn" data-action="publish" data-id="${item.id}" aria-label="Добавить в публичную библиотеку" title="Добавить в публичную библиотеку">
            ${ICONS.cloud}
          </button>
        ` : ''}
      </div>
    `;
  } else {
    card.innerHTML = thumbHtml;
  }

  card.querySelectorAll('.fav-btn svg').forEach(svg => svg.setAttribute('fill', isFav ? 'currentColor' : 'none'));

  card.addEventListener('click', () => onOpen(item.id));
  card.querySelectorAll('.fav-btn').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    onToggleFav(item.id);
  }));
  card.querySelectorAll('.card__btn:not([data-action="publish"])').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    onToggleSelect(item.id);
  }));

  if (showDots) {
    const dotsWrap = card.querySelector('.card__dots');
    const img = card.querySelector('.card__thumb-inner img');
    dotsWrap.querySelectorAll('.card__dot').forEach(dot => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        const idx = Number(dot.dataset.index);
        cardPreviewIndex[item.id] = idx;
        if (img && pages[idx].preview) img.src = pages[idx].preview;
        dotsWrap.querySelectorAll('.card__dot').forEach(d =>
          d.classList.toggle('card__dot--active', Number(d.dataset.index) === idx)
        );
      });
    });
  }

  const pubBtn = card.querySelector('[data-action="publish"]');
  if (pubBtn) {
    pubBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      movePersonalToPublic(item.id).catch(err => {
        console.error('Ошибка публикации:', err);
        setStatus('❌ Ошибка: ' + err.message, 'error');
      });
    });
  }

  return card;
}

function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  persistFavorites();
  renderAll();
}

function toggleSelect(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  renderContent();
  renderRecent();
  updateFooterState();
}

function renderTilePanel(kind) {
  const items = getTileItems(kind);
  $grid.className = kind === 'icons' ? 'grid grid--icons' : 'grid';
  if (!items.length) {
    $grid.innerHTML = `<p class="empty">${activeScope === 'personal' ? 'В личном пока пусто — выберите папку в личном кабинете' : 'Ничего не найдено'}</p>`;
    return;
  }
  $grid.innerHTML = '';
  items.forEach(tile => $grid.appendChild(buildTileNode(tile)));
}

function buildTileNode(tile) {
  const isSelected = panelSelectedId === tile.id;
  const el = document.createElement('div');

  if (tile.visual === 'image' || tile.preview) {
    if (tile.kind === 'photos') {
      el.className = 'tile tile--photo' + (isSelected ? ' tile--selected' : '');
      el.innerHTML = `<img src="${tile.preview || tile.file}" alt="${tile.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
    } else if (tile.kind === 'illustrations') {
      el.className = 'tile tile--3d' + (isSelected ? ' tile--selected' : '');
      el.innerHTML = `<div class="tile__shape" style="background:url('${tile.preview || tile.file}') center/cover no-repeat; width:100%;height:100%;"></div>`;
    } else if (tile.kind === 'icons') {
      el.className = 'tile tile--icon' + (isSelected ? ' tile--selected' : '');
      el.innerHTML = `<img src="${tile.preview || tile.file}" alt="${tile.name}" style="width:70%;height:70%;object-fit:contain;">`;
    } else if (tile.kind === 'logos') {
      el.className = 'tile tile--logo' + (isSelected ? ' tile--selected' : '');
      el.style.background = '#fff';
      el.innerHTML = `<img src="${tile.preview || tile.file}" alt="${tile.name}" style="width:80%;height:80%;object-fit:contain;">`;
    } else {
      el.className = 'tile tile--imported' + (isSelected ? ' tile--selected' : '');
      el.innerHTML = `<img src="${tile.preview || tile.file}" alt="${tile.name}" style="width:100%;height:100%;object-fit:cover;">`;
    }
  } else {
    el.className = 'tile tile--imported' + (isSelected ? ' tile--selected' : '');
    el.innerHTML = `<img src="${tile.preview}" alt="${tile.name}">`;
  }

  el.addEventListener('click', () => selectPanelItem(tile.id));
  return el;
}

function renderTemplatesPanel() {
  if (activeScope === 'personal' && showTemplateUploadForm) {
    $grid.className = 'grid grid--form';
    renderAddFileForm($grid, {
      full: false,
      onCancel: () => { showTemplateUploadForm = false; renderCategoryHeader(); renderContent(); },
      onSubmit: (data) => { addPersonalTemplateFromForm(data); },
    });
    return;
  }
  const items = getDeckSlides('templates');
  $grid.className = 'grid grid--list';
  if (!items.length) {
    $grid.innerHTML = `<p class="empty">${activeScope === 'personal' ? 'В личном пока пусто — выберите папку в личном кабинете или загрузите свой шаблон' : 'Макеты появятся здесь'}</p>`;
    return;
  }
  $grid.innerHTML = '';
  items.forEach(item => $grid.appendChild(buildCard(item, {
    mode: 'list',
    selected: selectedIds.has(item.id),
    dots: true,
  })));
}

async function addPersonalTemplateFromForm(data) {
  setStatus('⏳ Сохраняем шаблон…', '');
  try {
    const isPptx = /\.(pptx?|potx?)$/i.test(data.file.name);
    const fileDataUrl = await fileToDataUrl(data.file);
    const id = 'upload-templates-' + slugify(data.name) + '-' + Date.now();
    const deck = {
      id, name: data.name, scope: 'personal', kind: 'templates', color: '#2688EB',
      version: '', lastUpdated: new Date().toISOString().slice(0, 7), approved: true, approvedBy: '-',
      category: data.fields.contentType, tags: data.tags,
      file: isPptx ? fileDataUrl : undefined,
      preview: isPptx ? null : fileDataUrl,
      slides: isPptx ? [{ name: data.name, file: fileDataUrl, preview: null }] : undefined,
    };
    slides.push(deck);
    showTemplateUploadForm = false;
    renderAll();
    if (!isPptx) {
      setStatus(`✅ «${deck.name}» сохранён как изображение-референс — для вставки как слайда нужен .pptx`, 'success');
      return;
    }
    try {
      await persistLibraryDeck(deck);
      setStatus(`✅ Шаблон «${deck.name}» сохранён в личную библиотеку`, 'success');
    } catch (persistErr) {
      console.warn('[Slidebrary] Could not persist uploaded template:', persistErr);
      setStatus(`⚠️ Добавлено на эту сессию, но не сохранилось: ${persistErr.message}`, 'error');
    }
  } catch (err) {
    console.error('[Slidebrary] Add template error:', err);
    setStatus('❌ Ошибка: ' + err.message, 'error');
  }
}

function selectPanelItem(id) {
  panelSelectedId = panelSelectedId === id ? null : id;
  renderContent();
  updateFooterState();
}

function updateFooterState() {
  const hasSelection = DECK_SECTIONS.includes(activeSection)
    ? selectedIds.size > 0
    : !!panelSelectedId;
  $footerInsertBtn.classList.toggle('is-active', hasSelection);
}

function updateToolbarIcons() {
  $sortBtn.innerHTML = ICONS.sort;
  const isList = viewMode === 'list';
  const isDeckSection = DECK_SECTIONS.includes(activeSection);
  $viewToggleBtn.innerHTML = isDeckSection ? (isList ? ICONS.viewGrid : ICONS.viewList) : '';
  $exportBtn.innerHTML = ICONS.download;
  if (!$avatarBtn.innerHTML) $avatarBtn.innerHTML = ICONS.avatar;
}

function setStatus(message, type) {
  $status.textContent = message;
  $status.className = 'status' + (type ? ` status--${type}` : '');
  if (type === 'success') {
    setTimeout(() => {
      $status.textContent = '';
      $status.className = 'status';
    }, 5000);
  }
}

function toBase64(fileOrUrl) {
  if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    });
  }
  if (typeof fileOrUrl !== 'string') {
    if (fileOrUrl && typeof fileOrUrl === 'object' && fileOrUrl.data) {
      fileOrUrl = fileOrUrl.data;
    }
    if (typeof fileOrUrl !== 'string') {
      fileOrUrl = String(fileOrUrl);
    }
  }
  if (fileOrUrl.startsWith('data:')) {
    return Promise.resolve(fileOrUrl.split(',')[1]);
  }
  const url = fileOrUrl.startsWith('http') ? fileOrUrl : (window.location.origin + '/' + fileOrUrl);
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Файл не найден: ${url}`);
      return res.arrayBuffer();
    })
    .then(buffer => btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')));
}

function insertItems(items) {
  if (!items.length || insertingIds.size) return;
  items.forEach(it => insertingIds.add(it.id));
  renderContent();
  renderRecent();
  setStatus(items.length > 1 ? `⏳ Загрузка слайдов (${items.length})...` : '⏳ Загрузка слайда...', '');

  Promise.all(items.map(it => toBase64(it.file)))
    .then(base64List => {
      if (typeof PowerPoint === 'undefined') {
        throw new Error('PowerPoint API не загружен. Проверьте подключение Office.js.');
      }
      return PowerPoint.run(async context => {
        base64List.forEach(b64 => context.presentation.insertSlidesFromBase64(b64));
        await context.sync();
      });
    })
    .then(async () => {
      for (const it of items) await addToRecent(it.id);
      insertingIds.clear();
      selectedIds.clear();
      panelSelectedId = null;
      renderAll();
      setStatus(items.length > 1 ? `✅ Вставлено слайдов: ${items.length}` : '✅ Слайд вставлен в презентацию!', 'success');
    })
    .catch(err => {
      console.error('[Slidebrary] Insert error:', err);
      insertingIds.clear();
      renderContent();
      setStatus('❌ Ошибка: ' + err.message, 'error');
    });
}

function insertSlide(id, filePath) {
  insertItems([{ id, file: filePath }]);
}

function exportItems(items) {
  setStatus(`⏳ Скачивание (${items.length})...`, '');
  const promises = items.map(item => {
    if (item.file instanceof File || item.file instanceof Blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(item.file);
      link.download = item.name || 'slide.pptx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      return Promise.resolve(true);
    }
    const url = item.file.startsWith('http') ? item.file : (window.location.origin + '/' + item.file);
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Файл не найден: ${url}`);
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (item.name || 'slide') + (item.file.match(/\.[a-z0-9]+$/i) || ['.pptx'])[0];
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      });
  });
  Promise.all(promises)
    .then(() => setStatus(`✅ Скачано файлов: ${items.length}`, 'success'))
    .catch(err => {
      console.error('[Slidebrary] Export error:', err);
      setStatus('❌ Ошибка: ' + err.message, 'error');
    });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getTileInsertDataUrl(tile) {
  if (tile.file instanceof File || tile.file instanceof Blob) {
    return await fileToDataUrl(tile.file);
  }
  if (typeof tile.file === 'string') {
    if (tile.file.startsWith('data:')) {
      return tile.file;
    }
    let url = tile.file;
    if (!url.startsWith('http')) {
      url = window.location.origin + '/' + url.replace(/^\/+/, '');
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} — ${response.statusText}`);
      }
      const blob = await response.blob();
      return await fileToDataUrl(blob);
    } catch (err) {
      console.error('Ошибка загрузки файла по пути:', url, err);
      throw new Error(`Не удалось загрузить файл: ${tile.file}`);
    }
  }
  return tile.file;
}

async function insertTileImage(tile) {
  if (insertingIds.has(tile.id)) return;
  if (!tile.file) {
    setStatus('❌ Ошибка: у выбранного элемента отсутствует файл.', 'error');
    console.error('[insertTileImage] tile.file is missing', tile);
    return;
  }

  insertingIds.add(tile.id);
  renderContent();
  setStatus('⏳ Вставка изображения...', '');

  try {
    const dataUrl = await getTileInsertDataUrl(tile);
    if (!dataUrl) {
      throw new Error('Не удалось получить data URL изображения');
    }
    await insertImageCommonApi(dataUrl);
    insertingIds.delete(tile.id);
    panelSelectedId = null;
    renderAll();
    setStatus('✅ Изображение вставлено на слайд!', 'success');
  } catch (err) {
    console.error('[Slidebrary] Image insert error:', err);
    insertingIds.delete(tile.id);
    renderContent();
    const errorMsg = err.message || String(err) || 'неизвестная ошибка';
    setStatus(`❌ Ошибка: ${errorMsg}`, 'error');
  }
}

function insertImageCommonApi(dataUrl) {
  return new Promise((resolve, reject) => {
    if (!window.Office || !Office.context || !Office.context.document || !Office.context.document.setSelectedDataAsync) {
      reject(new Error('Office.context.document.setSelectedDataAsync недоступен в этом окружении.'));
      return;
    }
    if (!dataUrl || typeof dataUrl !== 'string' || dataUrl.length === 0) {
      reject(new Error('Нет данных изображения для вставки.'));
      return;
    }
    let base64Data = dataUrl;
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      if (parts.length === 2) {
        base64Data = parts[1];
      } else {
        reject(new Error('Некорректный data URL'));
        return;
      }
    }

    Office.context.document.setSelectedDataAsync(
      base64Data,
      { coercionType: Office.CoercionType.Image },
      (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          reject(new Error(asyncResult.error ? asyncResult.error.message : 'Не удалось вставить изображение'));
        } else {
          resolve();
        }
      }
    );
  });
}

function getActivePresentationBase64() {
  return new Promise((resolve, reject) => {
    if (!window.Office || !Office.context || !Office.context.document || !Office.context.document.getFileAsync) {
      reject(new Error('Office.context.document.getFileAsync недоступен в этом окружении.'));
      return;
    }
    Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 65536 }, (result) => {
      if (result.status !== Office.AsyncResultStatus.Succeeded) {
        reject(new Error((result.error && result.error.message) || 'Не удалось получить файл презентации'));
        return;
      }
      const file = result.value;
      const sliceCount = file.sliceCount;
      const slices = [];
      let received = 0;

      function getSlice(index) {
        file.getSliceAsync(index, (sliceResult) => {
          if (sliceResult.status !== Office.AsyncResultStatus.Succeeded) {
            file.closeAsync();
            reject(new Error((sliceResult.error && sliceResult.error.message) || 'Ошибка чтения файла'));
            return;
          }
          slices[index] = sliceResult.value.data;
          received++;
          if (received === sliceCount) {
            file.closeAsync();
            let totalLength = 0;
            slices.forEach(s => { totalLength += s.length; });
            const merged = new Uint8Array(totalLength);
            let offset = 0;
            slices.forEach(s => { merged.set(s, offset); offset += s.length; });
            let binary = '';
            const chunk = 0x8000;
            for (let i = 0; i < merged.length; i += chunk) {
              binary += String.fromCharCode.apply(null, merged.subarray(i, i + chunk));
            }
            resolve(btoa(binary));
          } else {
            getSlice(index + 1);
          }
        });
      }

      if (sliceCount > 0) getSlice(0);
      else reject(new Error('Пустой файл презентации'));
    });
  });
}

async function getActivePresentationSlidePreviews() {
  if (typeof PowerPoint === 'undefined') return [];
  return await PowerPoint.run(async context => {
    const slidesColl = context.presentation.slides;
    slidesColl.load('items');
    await context.sync();
    const imageResults = slidesColl.items.map(s => s.getImageAsBase64());
    await context.sync();
    return imageResults.map(r => 'data:image/png;base64,' + r.value);
  });
}

const PERSONAL_LIBRARY_KEY = 'sl_personal_library_json';

async function loadPersonalLibraryJson() {
  if (!hasStorage) return [];
  try {
    const raw = await storageImpl.getItem(PERSONAL_LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function persistLibraryDeck(item) {
  if (!hasStorage) throw new Error('Хранилище недоступно');
  const list = await loadPersonalLibraryJson();
  const idx = list.findIndex(x => x.id === item.id);
  if (idx >= 0) list[idx] = item; else list.push(item);
  await storageImpl.setItem(PERSONAL_LIBRARY_KEY, JSON.stringify(list));
}

async function loadLibraryDecksFromStorage() {
  const list = await loadPersonalLibraryJson();
  list.forEach(item => {
    if (TILE_SECTIONS.includes(item.kind)) {
      if (!tiles.some(t => t.id === item.id)) tiles.push(item);
    } else {
      if (!slides.some(s => s.id === item.id)) slides.push(item);
    }
  });
}

async function downloadPersonalLibraryJson() {
  const list = await loadPersonalLibraryJson();
  const payload = { version: new Date().toISOString().slice(0, 10), scope: 'personal', slides: list };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'personal-library.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function addActivePresentationToLibrary() {
  setStatus('⏳ Читаем текущую презентацию…', '');
  try {
    const [wholeBase64, previews] = await Promise.all([
      getActivePresentationBase64(),
      getActivePresentationSlidePreviews().catch(() => []),
    ]);
    const fileDataUrl = 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,' + wholeBase64;
    const pageList = previews.length ? previews : [null];
  const pages = pageList.map((preview, i) => ({ name: 'Слайд ' + (i + 1), preview, file: fileDataUrl }));
    let name = 'Моя презентация';
    try {
      const url = Office.context.document.url;
      if (url) name = url.split(/[\\/]/).pop().replace(/\.pptx?$/i, '') || name;
    } catch (e) {}

    const id = 'lib-' + slugify(name) + '-' + Date.now();
    const deck = {
      id, name, scope: 'personal', kind: 'presentations', color: '#2688EB',
      version: '', lastUpdated: new Date().toISOString().slice(0, 7), approved: true, approvedBy: '-',
      file: fileDataUrl, preview: pages[0].preview, slides: pages,
    };
    slides.push(deck);
    renderAll();

    try {
      await persistLibraryDeck(deck);
      setStatus(`✅ Добавлено в библиотеку и сохранено: «${deck.name}» (${pages.length} стр.)`, 'success');
    } catch (persistErr) {
      console.warn('[Slidebrary] Could not persist library deck:', persistErr);
      setStatus(`⚠️ Добавлено на эту сессию, но не сохранилось (${persistErr.message}). Возможно, превышен лимит хранилища.`, 'error');
    }
  } catch (err) {
    console.error('[Slidebrary] Add to library error:', err);
    setStatus('❌ Ошибка: ' + err.message, 'error');
  }
}

function updateLibraryButtonVisibility() {
  if (!$addToLibraryBtn) return;
  const show = activeScope === 'personal' && DECK_SECTIONS.includes(activeSection);
  $addToLibraryBtn.style.display = show ? 'flex' : 'none';
}

if ($addToLibraryBtn) {
  $addToLibraryBtn.addEventListener('click', () => {
    $addToLibraryBtn.classList.add('is-active');
    addActivePresentationToLibrary()
      .catch(e => console.error(e))
      .finally(() => {
        setTimeout(() => $addToLibraryBtn.classList.remove('is-active'), 1500);
      });
  });
}

$exportBtn.addEventListener('click', () => {
  if (!selectedIds.size) {
    setStatus('Сначала выберите презентации для скачивания', '');
    return;
  }
  const items = [...selectedIds]
    .map(id => {
      const slide = slides.find(s => s.id === id);
      if (!slide) return null;
      const file = getActiveFile(slide);
      return file ? { ...slide, file } : null;
    })
    .filter(Boolean);
  if (!items.length) {
    setStatus('Выбранные слайды не найдены', '');
    return;
  }
  exportItems(items);
});

$sortBtn.addEventListener('click', () => {
  if (!DECK_SECTIONS.includes(activeSection)) return;
  sortMode = sortMode === 'name' ? 'date' : 'name';
  setStatus(sortMode === 'name' ? 'Сортировка: по алфавиту' : 'Сортировка: по дате', '');
  renderContent();
});

$viewToggleBtn.addEventListener('click', () => {
  if (!DECK_SECTIONS.includes(activeSection)) return;
  viewMode = viewMode === 'grid' ? 'list' : 'grid';
  renderAll();
});

function renderFiltersBody() {
  $filtersBody.innerHTML = '';
  FILTER_FACETS.forEach(facet => {
    const field = document.createElement('div');
    field.className = 'filter-field';
    const label = document.createElement('label');
    label.className = 'filter-field__label';
    label.textContent = facet.label;
    field.appendChild(label);
    const dd = createDropdown({
      options: facet.options,
      value: draftFacetValues[facet.key],
      onChange: (val) => { draftFacetValues[facet.key] = val; },
    });
    dd.classList.add('dropdown--filter');
    field.appendChild(dd);
    $filtersBody.appendChild(field);
  });

  const checkboxRow = document.createElement('label');
  checkboxRow.className = 'filter-checkbox-row';
  checkboxRow.innerHTML = `<input type="checkbox" id="aiOnlyCheckbox" ${draftAiOnly ? 'checked' : ''}> ИИ-генерации`;
  $filtersBody.appendChild(checkboxRow);
  document.getElementById('aiOnlyCheckbox').addEventListener('change', e => {
    draftAiOnly = e.target.checked;
  });
}

function openFiltersView() {
  draftFacetValues = { ...appliedFacetValues };
  draftAiOnly = appliedAiOnly;
  renderFiltersBody();
  $mainView.style.display = 'none';
  $filtersView.style.display = 'flex';
}

function closeFiltersView() {
  $filtersView.style.display = 'none';
  $mainView.style.display = 'flex';
}

$filterBtn.addEventListener('click', openFiltersView);
$closeFiltersBtn.addEventListener('click', closeFiltersView);

$clearFiltersBtn.addEventListener('click', () => {
  draftFacetValues = { ...DEFAULT_FILTER_VALUES };
  draftAiOnly = false;
  renderFiltersBody();
});

$applyFiltersBtn.addEventListener('click', () => {
  appliedFacetValues = { ...draftFacetValues };
  appliedAiOnly = draftAiOnly;
  closeFiltersView();
  renderContent();
  const activeCount = Object.entries(appliedFacetValues).filter(([, v]) => v !== 'Все').length + (appliedAiOnly ? 1 : 0);
  setStatus(activeCount ? `Применено фильтров: ${activeCount}` : '', '');
});

function openCabinetView() {
  $mainView.style.display = 'none';
  $cabinetView.style.display = 'flex';
}

function closeCabinetView() {
  $cabinetView.style.display = 'none';
  $mainView.style.display = 'flex';
}

$avatarBtn.addEventListener('click', openCabinetView);

const $suggestView = document.getElementById('suggestView');
const $suggestBody = document.getElementById('suggestBody');
const $closeSuggestBtn = document.getElementById('closeSuggestBtn');
const $suggestBackBtn = document.getElementById('suggestBackBtn');

function openSuggestView() {
  $suggestBody.innerHTML = '';
  renderAddFileForm($suggestBody, {
    full: true,
    onCancel: closeSuggestView,
    onSubmit: (data) => submitFileSuggestion(data),
  });
  $mainView.style.display = 'none';
  $suggestView.style.display = 'flex';
}

function closeSuggestView() {
  $suggestView.style.display = 'none';
  $mainView.style.display = 'flex';
}

const SUGGESTIONS_KEY = 'sl_suggestions_json';

async function loadSuggestionsJson() {
  if (!hasStorage) return [];
  try {
    const raw = await storageImpl.getItem(SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function downloadSuggestionsJson() {
  const list = await loadSuggestionsJson();
  const blob = new Blob([JSON.stringify({ suggestions: list }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'suggested-files.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function submitFileSuggestion(data) {
  try {
    const fileDataUrl = await fileToDataUrl(data.file);
    const suggestion = {
      id: 'suggest-' + Date.now(),
      name: data.name,
      submittedAt: new Date().toISOString(),
      fields: data.fields,
      tags: data.tags,
      aiGenerated: data.aiGenerated,
      fileDataUrl,
    };
    if (hasStorage) {
      try {
        const list = await loadSuggestionsJson();
        list.push(suggestion);
        await storageImpl.setItem(SUGGESTIONS_KEY, JSON.stringify(list));      } catch (e) {
        console.warn('[Slidebrary] Could not persist suggestion:', e);
      }
    }
    closeSuggestView();
    setStatus(`✅ «${data.name}» сохранено локально (без бэкенда это не отправляется другим людям — скачайте suggested-files.json в Личном кабинете и передайте тому, кто ведёт catalog.json)`, 'success');
  } catch (err) {
    console.error('[Slidebrary] Suggestion error:', err);
    setStatus('❌ Ошибка: ' + err.message, 'error');
  }
}

function base64ToBlob(base64Data, contentType = 'application/octet-stream') {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}


function mapServerAssetPath(path) {
  if (!path) return path;
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  return 'http://localhost:3001/' + path;
}

async function refreshCatalogData() {
  try {
    const response = await fetch('http://localhost:3001/assets/catalog.json', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const publicSlides = data.slides || [];
      const publicTiles = data.tiles || [];
      const personalSlides = slides.filter(s => s.scope === 'personal');
      const personalTiles = tiles.filter(t => t.scope === 'personal');
      slides = [...publicSlides, ...personalSlides];
      tiles = [...publicTiles, ...personalTiles];
      renderAll();
    } else {
      console.warn('Не удалось получить каталог');
    }
  } catch (error) {
    console.error('Ошибка обновления каталога:', error);
  }
}

let catalogSyncInterval = null;

function startAutoSync() {
  if (catalogSyncInterval) return;
  catalogSyncInterval = setInterval(async () => {
    try {
      const response = await fetch('http://localhost:3001/assets/catalog.json', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const newSlides = data.slides || data;
        const newTiles = data.tiles || [];
        
        const slidesChanged = JSON.stringify(slides) !== JSON.stringify(newSlides);
        const tilesChanged = JSON.stringify(tiles) !== JSON.stringify(newTiles);
        
        if (slidesChanged || tilesChanged) {
          await refreshCatalogData();
        }
      }
    } catch (e) {}
  }, 5000);
}

startAutoSync();

async function movePersonalToPublic(itemId) {
  const item = slides.find(s => s.id === itemId) || tiles.find(t => t.id === itemId);
  if (!item) return;
  if (!item.file) {
    setStatus('❌ Не удалось найти файл для публикации', 'error');
    return;
  }

  setStatus('⏳ Отправляем на сервер...', '');

  try {
    let blob;
    if (typeof item.file === 'string' && item.file.startsWith('data:')) {
      const [meta, data] = item.file.split(',');
      const mime = meta.match(/:(.*?);/)[1] || 'application/octet-stream';
      blob = base64ToBlob(data, mime);
    } else if (item.file instanceof Blob) {
      blob = item.file;
    } else if (typeof item.file === 'string') {
      const res = await fetch(item.file);
      blob = await res.blob();
    } else {
      throw new Error('Не удалось распознать формат файла');
    }

    const formData = new FormData();
    formData.append('file', blob, (item.name || 'slide') + '.pptx');
    formData.append('name', item.name);
    formData.append('tags', JSON.stringify(item.tags || []));
    formData.append('category', item.category || 'Без категории');

    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Ошибка сервера: ${response.status}`);
    }

    setStatus(`✅ «${item.name}» опубликована в библиотеке!`, 'success');
    
    setTimeout(async () => {
      await refreshCatalogData();
    }, 1200);

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    
    if (error instanceof TypeError) {
      setStatus('⚠️ Сервер не запущен. Сохраняем локально...', 'error');
      
      const publicItem = {
        id: item.id.replace('local-', 'pub-'),
        name: item.name,
        category: item.category || 'Без категории',
        tags: item.tags || [],
        file: item.file,
        pendingFile: true
      };

      if (hasStorage) {
        const list = await loadSuggestionsJson();
        list.push(publicItem);
        await storageImpl.setItem(SUGGESTIONS_KEY, JSON.stringify(list));
        setStatus(`⚠️ Сервер не запущен. Сохранено в suggested-files.json.`, 'error');
      } else {
        setStatus('❌ Хранилище недоступно.', 'error');
      }
    } else {
      setStatus(`❌ Ошибка сервера: ${error.message}`, 'error');
    }
  }
}

if ($closeSuggestBtn) $closeSuggestBtn.addEventListener('click', closeSuggestView);
if ($suggestBackBtn) $suggestBackBtn.addEventListener('click', closeSuggestView);

const $aiView = document.getElementById('aiView');
const $aiBody = document.getElementById('aiBody');
const $closeAiBtn = document.getElementById('closeAiBtn');
const $aiBackBtn = document.getElementById('aiBackBtn');

function openAiView() {
  $aiBody.innerHTML = '';

  const topicLabel = document.createElement('label');
  topicLabel.className = 'filter-field__label';
  topicLabel.textContent = 'Опишите тему';
  $aiBody.appendChild(topicLabel);

  const topicWrap = document.createElement('div');
  topicWrap.className = 'ai-textarea-wrap';
  const textarea = document.createElement('textarea');
  textarea.className = 'ai-textarea';
  textarea.maxLength = 2000;
  textarea.placeholder = 'Добавьте запрос здесь...';
  const counter = document.createElement('span');
  counter.className = 'ai-textarea__counter';
  counter.textContent = '0/2000';
  textarea.addEventListener('input', () => {
    counter.textContent = `${textarea.value.length}/2000`;
    updateStartState();
  });
  topicWrap.appendChild(textarea);
  topicWrap.appendChild(counter);
  $aiBody.appendChild(topicWrap);

  function addSelect(labelText, options) {
    const field = document.createElement('div');
    field.className = 'filter-field';
    const label = document.createElement('label');
    label.className = 'filter-field__label';
    label.textContent = labelText;
    field.appendChild(label);
    const dd = createDropdown({ options, value: options[0], onChange: () => {} });
    dd.classList.add('dropdown--filter');
    field.appendChild(dd);
    $aiBody.appendChild(field);
    return dd;
  }

  addSelect('Количество слайдов', ['4', '6', '8', '10', '12']);
  addSelect('Язык презентации', ['Русский', 'English']);
  addSelect('Содержание', ['Кратко', 'Подробно']);
  addSelect('Источник изображений', ['Без изображений', 'Изображения ИИ', 'Из библиотеки']);

  const advRow = document.createElement('label');
  advRow.className = 'category-header__row switch-row';
  advRow.style.marginTop = '4px';
  const advLabel = document.createElement('span');
  advLabel.className = 'category-header__label';
  advLabel.textContent = 'Расширенный ИИ';
  const advSwitch = createToggleSwitch(true, () => {});
  advRow.appendChild(advLabel);
  advRow.appendChild(advSwitch);
  $aiBody.appendChild(advRow);

  const actions = document.createElement('div');
  actions.className = 'upload-form__actions';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn--secondary';
  cancelBtn.textContent = 'Отменить';
  const startBtn = document.createElement('button');
  startBtn.type = 'button';
  startBtn.className = 'btn btn--primary';
  startBtn.textContent = 'Начать';
  actions.appendChild(cancelBtn);
  actions.appendChild(startBtn);
  $aiBody.appendChild(actions);

  function updateStartState() {
    const ready = textarea.value.trim().length > 0;
    startBtn.classList.toggle('is-active', ready);
    cancelBtn.classList.toggle('is-active', ready);
  }
  updateStartState();

  cancelBtn.addEventListener('click', closeAiView);
  startBtn.addEventListener('click', () => {
    if (!textarea.value.trim()) return;
    setStatus('⚠️ Генерация пока не подключена к бэкенду — форма готова, не хватает сервера с ИИ-провайдером за ней', 'error');
  });

  $mainView.style.display = 'none';
  $aiView.style.display = 'flex';
}

function closeAiView() {
  $aiView.style.display = 'none';
  $mainView.style.display = 'flex';
}

if ($closeAiBtn) $closeAiBtn.addEventListener('click', closeAiView);
if ($aiBackBtn) $aiBackBtn.addEventListener('click', closeAiView);
$cabinetBackBtn.addEventListener('click', closeCabinetView);
$closeCabinetBtn.addEventListener('click', closeCabinetView);
$cabinetCancelBtn.addEventListener('click', closeCabinetView);
$cabinetSaveBtn.addEventListener('click', () => {
  closeCabinetView();
  setStatus('✅ Настройки сохранены', 'success');
});

function stripExt(filename) {
  return filename.replace(/\.[^.]+$/, '');
}

function naturalSort(a, b) {
  return a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' });
}

function slugify(str) {
  return (str || '').toString().toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '') || 'x';
}

function classifyFilesForImport(fileList) {
  const deckBuckets = {};  
  const tileBuckets = {};   
  let rootName = '';
  let unmatchedCount = 0;

  Array.from(fileList).forEach(file => {
    const rel = file.webkitRelativePath || file.name;
    const parts = rel.split('/').filter(Boolean);
    if (parts.length < 2) { unmatchedCount++; return; }
    if (!rootName) rootName = parts[0];
    const sectionRaw = (parts[1] || '').trim().toLowerCase();
    const kind = FOLDER_LABEL_TO_KIND[sectionRaw];
    if (!kind) { unmatchedCount++; return; }
    const restParts = parts.slice(2);
    if (!restParts.length) return;
    const filename = restParts[restParts.length - 1];
    const subDirs = restParts.slice(0, -1);

    if (DECK_SECTIONS.includes(kind) || kind === 'favorites') {
      if (!/\.(pptx?|potx?|png|jpe?g|webp)$/i.test(filename)) { unmatchedCount++; return; }
      const deckKey = subDirs.length ? subDirs.join('/') : ('__single__/' + filename);
      deckBuckets[kind] = deckBuckets[kind] || {};
      deckBuckets[kind][deckKey] = deckBuckets[kind][deckKey] || {
        name: subDirs.length ? subDirs[subDirs.length - 1] : stripExt(filename),
        files: [],
      };
      deckBuckets[kind][deckKey].files.push({ file, filename });
    } else {
      if (!/\.(png|jpe?g|webp|gif)$/i.test(filename)) { unmatchedCount++; return; }
      tileBuckets[kind] = tileBuckets[kind] || [];
      tileBuckets[kind].push({ file, filename, category: subDirs.length ? subDirs[subDirs.length - 1] : undefined });
    }
  });

  return { rootName, deckBuckets, tileBuckets, unmatchedCount };
}

function buildDecksFromBucket(rootName, kind, bucket) {
  const decks = [];
  Object.keys(bucket).forEach(deckKey => {
    const group = bucket[deckKey];
    const byBase = {};
    group.files.forEach(({ file, filename }) => {
      const base = stripExt(filename).toLowerCase();
      byBase[base] = byBase[base] || {};
      if (/\.(pptx?|potx?)$/i.test(filename)) byBase[base].file = file;
      else if (/\.(png|jpe?g|webp)$/i.test(filename)) byBase[base].preview = URL.createObjectURL(file);
    });
    const bases = Object.keys(byBase).sort(naturalSort);
    const pages = bases
      .filter(b => byBase[b].file)
      .map(b => ({ name: b, file: byBase[b].file, preview: byBase[b].preview || null }));
    if (!pages.length) return;
   const deckId = 'local-' + slugify(rootName) + '-' + kind + '-' + slugify(deckKey);
    const deck = {
      id: deckId,
      name: group.name || pages[0].name,
      scope: 'personal',
      kind: kind === 'favorites' ? undefined : kind,
      color: '#2688EB',
      version: '', lastUpdated: '', approved: true, approvedBy: '-',
      file: pages[0].file, preview: pages[0].preview,
      slides: pages,
    };
    decks.push(deck);
    if (kind === 'favorites') favorites.add(deckId);
  });
  return decks;
}

function buildTilesFromBucket(rootName, kind, list) {
  return list.map((entry) => {
    const ext = (entry.filename.match(/\.([a-z0-9]+)$/i) || [, ''])[1].toUpperCase();
    return {
      id: 'local-' + slugify(rootName) + '-' + kind + '-' + slugify(entry.category || '') + '-' + slugify(stripExt(entry.filename)),
      name: stripExt(entry.filename),
      scope: 'personal',
      kind,
      category: entry.category,
      preview: URL.createObjectURL(entry.file),
      file: entry.file,
      visual: 'image',
      format: kind === 'icons' ? (ext === 'JPG' ? 'JPEG' : ext) : undefined,
    };
  });
}

async function handleFolderImport(fileList) {
  if (!fileList || !fileList.length) return;
  setStatus('⏳ Импортируем папку…', '');

  const { rootName, deckBuckets, tileBuckets, unmatchedCount } = classifyFilesForImport(fileList);

  let deckNew = 0, deckUpdated = 0;
  let tileNew = 0, tileUpdated = 0;

  for (const kind of Object.keys(deckBuckets)) {
    const decks = buildDecksFromBucket(rootName, kind, deckBuckets[kind]);
    for (const deck of decks) {
      if (deck.file instanceof File) {
        try {
          deck.file = await fileToDataUrl(deck.file);
        } catch (e) {
          console.warn('Не удалось прочитать файл презентации:', deck.name, e);
        }
      }
      if (deck.preview && deck.preview.startsWith('blob:')) {
        try {
          const file = deckBuckets[kind][deck.id]?.files.find(f => f.preview === deck.preview);
          } catch (e) {}
      }

      const idx = slides.findIndex(s => s.id === deck.id);
      if (idx >= 0) { slides[idx] = deck; deckUpdated++; }
      else { slides.push(deck); deckNew++; }
      
      try { await persistLibraryDeck(deck); } catch (e) { console.warn('Не удалось сохранить презентацию в JSON', e); }
    }
  }

  for (const kind of Object.keys(tileBuckets)) {
    const items = buildTilesFromBucket(rootName, kind, tileBuckets[kind]);
    for (const tile of items) {
      if (tile.file instanceof File) {
        try {
          tile.file = await fileToDataUrl(tile.file);
        } catch (e) { console.warn('Не удалось прочитать картинку:', tile.name, e); }
      }

      const idx = tiles.findIndex(t => t.id === tile.id);
      if (idx >= 0) { tiles[idx] = tile; tileUpdated++; }
      else { tiles.push(tile); tileNew++; }

      try { await persistLibraryDeck(tile); } catch (e) { console.warn('Не удалось сохранить картинку в JSON', e); }
    }
  }

  persistFavorites();
  $cabinetFolderLabel.textContent = rootName || 'Готово';
  activeScope = 'personal';
  renderAll();

  const parts = [];
  if (deckNew || deckUpdated) parts.push(`презентации: +${deckNew}` + (deckUpdated ? `, обновлено ${deckUpdated}` : ''));
  if (tileNew || tileUpdated) parts.push(`изображения: +${tileNew}` + (tileUpdated ? `, обновлено ${tileUpdated}` : ''));
  if (parts.length) {
    setStatus(`✅ Импортировано и сохранено в personal-library.json (${parts.join('; ')})` + (unmatchedCount ? ` — ${unmatchedCount} файлов пропущено` : ''), 'success');
  } else {
    setStatus('⚠️ В папке не нашлось подходящих файлов...', 'error');
  }
}

if ($cabinetFolderBtn && $folderImportInput) {
  $cabinetFolderBtn.addEventListener('click', () => $folderImportInput.click());
  $folderImportInput.addEventListener('change', e => {
    handleFolderImport(e.target.files);
    e.target.value = '';
  });
}

if ($downloadLibraryBtn) {
  $downloadLibraryBtn.addEventListener('click', () => downloadPersonalLibraryJson());
}
if ($downloadSuggestionsBtn) {
  $downloadSuggestionsBtn.addEventListener('click', () => downloadSuggestionsJson());
}

function openModal(id) {
  const item = slides.find(s => s.id === id);
  if (!item) return;
  modalSlideId = id;
  const color = item.color || '#2688EB';

  renderModalPages(item, getDeckPages(item));

 ensurePptxPagesParsed(item, (pages) => {
    if (modalSlideId !== item.id) return; 
    renderModalPages(item, pages);
  });

  const statusText = item.approved ? 'Утверждено' : 'На ревью';
  const statusClass = item.approved ? 'ok' : 'pending';

  $modalMeta.innerHTML = `
    <div class="meta-row"><span>Статус</span><b class="${statusClass}">${statusText}</b></div>
    <div class="meta-row"><span>Версия</span><b>${item.version || '—'}</b></div>
    <div class="meta-row"><span>Обновлён</span><b>${item.lastUpdated || '—'}</b></div>
    <div class="meta-row"><span>Владелец</span><b>${item.approvedBy || item.owner || '—'}</b></div>
  `;

  if (item.versions && item.versions.length > 0) {
    $modalVersions.style.display = 'block';
    $versionsList.innerHTML = '';
    const sorted = [...item.versions].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    sorted.forEach(ver => {
      const li = document.createElement('li');
      const isCurrent = ver.version === item.version;
      li.innerHTML = `
        <div class="ver-info">
          <span class="ver-name">${ver.version}${isCurrent ? ' (текущая)' : ''}</span>
          <span class="ver-date">${ver.date || ''}</span>
          ${ver.changes ? `<span class="ver-changes">${ver.changes}</span>` : ''}
        </div>
        <button class="ver-btn" data-file="${ver.file}" data-version="${ver.version}">Вставить</button>
      `;
      const btn = li.querySelector('.ver-btn');
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const file = btn.dataset.file;
        const version = btn.dataset.version;
        closeModal();
        setStatus(`⏳ Вставка версии ${version}...`, '');
        insertSlide(item.id, file);
      });
      $versionsList.appendChild(li);
    });
  } else {
    $modalVersions.style.display = 'none';
  }

  $modal.style.display = 'flex';
}

function renderModalPages(item, pages) {
  const color = item.color || '#2688EB';
  modalPreviewIndex = 0;

  const renderModalPreview = (idx) => {
    $modalPreview.style.background = color + '18';
    const page = pages[idx] || {};
    if (page.preview) {
      $modalPreviewImg.innerHTML = `<img src="${page.preview}" alt="${item.name}"
        onerror="this.outerHTML='<span style=\\'color:${color};\\' class=\\'modal__preview-fallback\\' aria-hidden=\\'true\\'>${ICONS.fileGlyph}</span>'"
      >`;
    } else if (page.autoTitle) {
      $modalPreviewImg.innerHTML = `
        <div class="modal__preview-textcard" style="background:${color};">
          <span class="modal__preview-textcard__index">${page.autoIndex || idx + 1}</span>
          <span class="modal__preview-textcard__title">${page.autoTitle}</span>
        </div>`;
    } else {
      $modalPreviewImg.innerHTML = `<span style="color:${color};" class="modal__preview-fallback" aria-hidden="true">${ICONS.fileGlyph}</span>`;
    }
  };

  const updateDots = () => {
    $modalDots.querySelectorAll('.modal-dot').forEach(d =>
      d.classList.toggle('modal-dot--active', Number(d.dataset.index) === modalPreviewIndex)
    );
  };

  const goToSlide = (index) => {
    if (index < 0 || index >= pages.length) return;
    modalPreviewIndex = index;
    renderModalPreview(index);
    updateDots();
  };

  renderModalPreview(0);

  const dotCount = pages.length;
  $modalDots.innerHTML = dotCount > 1
    ? pages.map((_, i) => `<span class="modal-dot${i === 0 ? ' modal-dot--active' : ''}" data-index="${i}"></span>`).join('')
    : '';
  $modalDots.style.display = dotCount > 1 ? 'flex' : 'none';

  if (dotCount > 1) {
    $modalDots.querySelectorAll('.modal-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(Number(dot.dataset.index));
      });
    });
  }

  let touchStartX = 0;
  $modalPreview.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  });
  $modalPreview.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goToSlide(modalPreviewIndex + 1);
      else goToSlide(modalPreviewIndex - 1);
    }
  });

  let mouseStartX = 0;
  $modalPreview.addEventListener('mousedown', e => {
    mouseStartX = e.clientX;
  });
  $modalPreview.addEventListener('mouseup', e => {
    const deltaX = e.clientX - mouseStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goToSlide(modalPreviewIndex + 1);
      else goToSlide(modalPreviewIndex - 1);
    }
  });

  $modalPreview.addEventListener('wheel', (e) => {
    if (pages.length <= 1) return;
    e.preventDefault(); 
    const delta = Math.sign(e.deltaY);
    if (delta > 0) goToSlide(modalPreviewIndex + 1);
    else if (delta < 0) goToSlide(modalPreviewIndex - 1);
  });

  if (modalKeydownHandler) {
    document.removeEventListener('keydown', modalKeydownHandler);
  }
  modalKeydownHandler = (e) => {
    if ($modal.style.display === 'none') return;
    if (pages.length <= 1) return;
    if (e.key === 'ArrowRight') goToSlide(modalPreviewIndex + 1);
    if (e.key === 'ArrowLeft') goToSlide(modalPreviewIndex - 1);
  };
  document.addEventListener('keydown', modalKeydownHandler);
}

function closeModal() {
  if (modalKeydownHandler) {
    document.removeEventListener('keydown', modalKeydownHandler);
    modalKeydownHandler = null;
  }
  $modal.style.display = 'none';
  modalSlideId = null;
}

$search.addEventListener('input', () => {
  searchQuery = $search.value;
  renderContent();
});

$modalClose.addEventListener('click', closeModal);
$modal.addEventListener('click', e => {
  if (e.target === $modal) closeModal();
});

$modalInsert.addEventListener('click', () => {
  if (!modalSlideId) return;
  const item = slides.find(s => s.id === modalSlideId);
  if (!item) return;
  const pages = getDeckPages(item);
  const idx = Math.min(modalPreviewIndex, pages.length - 1);
  const file = (pages[idx] && pages[idx].file) || item.file;
  closeModal();
  if (file) insertSlide(item.id, file);
});

$cancelBtn.addEventListener('click', () => {
  selectedIds.clear();
  panelSelectedId = null;
  renderContent();
  renderRecent();
  updateFooterState();
});

$footerInsertBtn.addEventListener('click', () => {
  if (DECK_SECTIONS.includes(activeSection)) {
    if (!selectedIds.size) {
      setStatus('Сначала выберите слайд', '');
      return;
    }
    const items = [...selectedIds]
      .map(id => {
        const slide = slides.find(s => s.id === id);
        if (!slide) return null;
        const file = getActiveFile(slide);
        return file ? { id, file } : null;
      })
      .filter(Boolean);
    insertItems(items);
    return;
  }
  if (TILE_SECTIONS.includes(activeSection)) {
    if (!panelSelectedId) {
      setStatus('Сначала выберите элемент', '');
      return;
    }
    const tile = tiles.find(t => t.id === panelSelectedId);
    if (!tile) {
      setStatus('Элемент не найден', '');
      return;
    }
    insertTileImage(tile);
    return;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if ($filtersView.style.display !== 'none') closeFiltersView();
    else if ($cabinetView.style.display !== 'none') closeCabinetView();
    else if ($suggestView && $suggestView.style.display !== 'none') closeSuggestView();
    else if ($aiView && $aiView.style.display !== 'none') closeAiView();
    else closeModal();
  }
});

if ($closeBtn) $closeBtn.addEventListener('click', () => setStatus('Закрыть панель можно из ленты PowerPoint', ''));

async function init() {
  await loadFromStorage();
  await loadLibraryDecksFromStorage();
  await loadCatalog(); 
}

Office.onReady(() => {
  init().catch(e => console.warn('[Slidebrary] Init error:', e));
});