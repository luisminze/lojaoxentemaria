// Função: alerta ao clicar no botão "Saiba Mais"
document.addEventListener('DOMContentLoaded', function() {
  // Removidos todos os alertas e popups

  // Filtro de produtos
  var filtroInput = document.getElementById('filtro-produto');
  if (filtroInput) {
    filtroInput.addEventListener('input', function() {
      var termo = filtroInput.value.toLowerCase();
      var produtos = document.querySelectorAll('.produto');
      produtos.forEach(function(produto) {
        var nome = produto.getAttribute('data-nome').toLowerCase();
        if (nome.includes(termo)) {
          produto.style.display = '';
        } else {
          produto.style.display = 'none';
        }
      });
    });
  }

  // Filtro de categorias
  var categoriaBtns = document.querySelectorAll('.categoria-btn');
  categoriaBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var categoria = btn.getAttribute('data-categoria');
      var produtos = document.querySelectorAll('.produto');
      produtos.forEach(function(produto) {
        var cat = produto.getAttribute('data-categoria');
        if (categoria === 'todos' || cat === categoria) {
          produto.style.display = '';
        } else {
          produto.style.display = 'none';
        }
      });
      // Limpa filtro de texto
      var filtroInput = document.getElementById('filtro-produto');
      if (filtroInput) filtroInput.value = '';
    });
  });

  // Carrinho de compras para catalogo.html
  var carrinho = [];

  function atualizarCarrinho() {
    var lista = document.getElementById('carrinho-lista');
    var total = document.getElementById('carrinho-total');
    if (!lista || !total) return;
    lista.innerHTML = '';
    var soma = 0;
    carrinho.forEach(function(item) {
      var li = document.createElement('li');
      li.textContent = item.nome + ' - R$ ' + item.preco.toFixed(2);
      lista.appendChild(li);
      soma += item.preco;
    });
    total.textContent = 'Total: R$ ' + soma.toFixed(2);
  }

  // Estoque: inicializa a partir dos elementos
  var estoqueMap = {};
  document.querySelectorAll('.produto').forEach(function(produto) {
    var nome = produto.getAttribute('data-nome');
    var estoque = parseInt(produto.getAttribute('data-estoque'));
    estoqueMap[nome] = estoque;
    var estoqueInfo = produto.querySelector('.estoque-info');
    if (estoqueInfo) estoqueInfo.textContent = 'Estoque: ' + estoque;
    var btn = produto.querySelector('.add-carrinho');
    if (estoque === 0 && btn) {
      btn.disabled = true;
      btn.textContent = 'Esgotado';
    }
  });

  function atualizarEstoque(nome, quantidade) {
    estoqueMap[nome] -= quantidade;
    document.querySelectorAll('.produto').forEach(function(produto) {
      if (produto.getAttribute('data-nome') === nome) {
        var estoqueInfo = produto.querySelector('.estoque-info');
        if (estoqueInfo) estoqueInfo.textContent = 'Estoque: ' + estoqueMap[nome];
        var btn = produto.querySelector('.add-carrinho');
        var input = produto.querySelector('.quantidade-input');
        if (estoqueMap[nome] <= 0 && btn) {
          btn.disabled = true;
          btn.textContent = 'Esgotado';
          if (input) input.disabled = true;
        } else if (input) {
          input.max = estoqueMap[nome];
          if (parseInt(input.value) > estoqueMap[nome]) input.value = estoqueMap[nome];
        }
      }
    });
  }

  function adicionarAoCarrinho(nome, preco, quantidade) {
    if (estoqueMap[nome] >= quantidade && quantidade > 0) {
      for (let i = 0; i < quantidade; i++) {
        carrinho.push({ nome: nome, preco: preco });
      }
      atualizarCarrinho();
      atualizarEstoque(nome, quantidade);
    }
  }

  // Adicionar ao carrinho com quantidade
  var botoes = document.querySelectorAll('.add-carrinho');
  botoes.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var produto = btn.closest('.produto');
      var nome = produto.getAttribute('data-nome');
      var preco = parseFloat(produto.getAttribute('data-preco'));
      var input = produto.querySelector('.quantidade-input');
      var quantidade = input ? parseInt(input.value) : 1;
      if (quantidade > estoqueMap[nome]) quantidade = estoqueMap[nome];
      adicionarAoCarrinho(nome, preco, quantidade);
    });
  });

  // Atualiza max do input ao carregar
  document.querySelectorAll('.produto').forEach(function(produto) {
    var nome = produto.getAttribute('data-nome');
    var input = produto.querySelector('.quantidade-input');
    if (input) {
      input.max = estoqueMap[nome];
      input.addEventListener('input', function() {
        if (parseInt(input.value) > estoqueMap[nome]) input.value = estoqueMap[nome];
        if (parseInt(input.value) < 1) input.value = 1;
      });
    }
  });

  // Finalizar compra
  var finalizarBtn = document.getElementById('finalizar-compra');
  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', function() {
      if (carrinho.length === 0) {
        // Nenhuma ação, apenas não faz nada se o carrinho estiver vazio
      } else {
        var nomes = carrinho.map(function(item) { return item.nome; }).join(', ');
        var mensagem = encodeURIComponent('Olá! gostaria de adquirir ' + nomes);
        window.location.href = 'https://wa.me/5599999999999?text=' + mensagem;
      }
    });
  }

  // Atualiza carrinho ao carregar página
  atualizarCarrinho();

  // Transição suave entre páginas
  function aplicarTransicaoLinks() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function(link) {
      var url = link.getAttribute('href');
      // Só aplica para links internos (mesma origem e não âncora)
      if (url && !url.startsWith('http') && !url.startsWith('#') && !url.startsWith('mailto:')) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          document.body.classList.add('fade-out');
          setTimeout(function() {
            window.location.href = url;
          }, 500); // tempo igual ao do CSS
        });
      }
    });
  }

  aplicarTransicaoLinks();
});

// Splash screen interativa
window.addEventListener('DOMContentLoaded', function() {
  var splash = document.getElementById('splash');
  var entrarBtn = document.getElementById('entrarSplash');
  function esconderSplash() {
    if (splash) {
      splash.setAttribute('aria-hidden', 'true');
      setTimeout(function() {
        splash.style.display = 'none';
      }, 700);
    }
  }
  if (entrarBtn) {
    entrarBtn.addEventListener('click', esconderSplash);
  }
  // Esconde automaticamente após 3 segundos
  setTimeout(esconderSplash, 3000);
});
