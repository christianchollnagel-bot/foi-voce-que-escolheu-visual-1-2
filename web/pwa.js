// A janela independente reserva a moldura do Windows antes de dimensionar a área do jogo.
if (matchMedia('(display-mode: standalone)').matches) {
  addEventListener('load', () => {
    const molduraX = Math.max(0, outerWidth - innerWidth);
    const molduraY = Math.max(0, outerHeight - innerHeight);
    const altura = Math.min(screen.availHeight - 32, 900);
    const largura = Math.round((altura - molduraY) * 9 / 16) + molduraX;
    window.resizeTo(largura, altura);
    window.moveTo(screen.availLeft + Math.round((screen.availWidth - largura) / 2),
                  screen.availTop + Math.round((screen.availHeight - altura) / 2));
  }, {once: true});
}
(() => {
  const version = 'Edição de continuidade · base Visual 1.2';
  let status = 'Preparando os arquivos para jogar sem conexão…';
  function announce(message) {
    status = message;
    document.querySelectorAll('fvqe-offline').forEach(el => el.render());
  }
  class OfflineStatus extends HTMLElement {
    connectedCallback() {
      this.setAttribute('role', 'status');
      this.render();
    }
    render() { this.textContent = version + ' · ' + status; }
  }
  customElements.define('fvqe-offline', OfflineStatus);
  if (window.chrome?.webview && location.origin === 'https://arquivo-visual.example') {
    announce('Pronto para jogar offline.');
    return;
  }
  if (!window.isSecureContext || !('serviceWorker' in navigator) || location.protocol === 'file:') {
    announce('Para instalar e preparar o modo offline, use o inicializador local ou HTTPS.');
    return;
  }
  // A instalação já verificou os arquivos. Reabrir a janela deve usar o registro local,
  // mesmo se uma tentativa de atualização pela rede estiver aguardando resposta.
  const instalado = matchMedia('(display-mode: standalone)').matches;
  navigator.serviceWorker.getRegistration('./').then(reg =>
    instalado && reg && reg.active ? reg :
      navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'})
  ).then(reg => {
    const ready = () => announce('Pronto para jogar offline.');
    const waiting = () => announce('Atualização pronta. Seu progresso fica salvo. Feche todas as janelas do jogo para aplicar a atualização e depois continue.');
    function watch(worker) {
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && reg.active) waiting();
        if (worker.state === 'activated') ready();
        if (worker.state === 'redundant' && !reg.waiting)
          announce(reg.active ? 'Atualização interrompida. A versão instalada continua disponível.' : 'Preparo offline incompleto. Reconecte e reabra o jogo.');
      });
    }
    reg.addEventListener('updatefound', () => watch(reg.installing));
    watch(reg.installing);
    if (reg.waiting) waiting();
    else if (reg.active) ready();
    else navigator.serviceWorker.ready.then(() => reg.waiting ? waiting() : ready());
    if (reg.active && !instalado) reg.update().catch(() => {});
  }).catch(() => announce('Não foi possível preparar o modo offline. Confira a conexão e reabra o jogo.'));
})();


