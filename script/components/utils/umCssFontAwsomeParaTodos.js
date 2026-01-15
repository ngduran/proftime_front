// No seu arquivo de estilos central
const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(`select { color: blue; } .input-group { ... }`);

// No construtor do seu componente
this.shadowRoot.adoptedStyleSheets = [sharedStyles];