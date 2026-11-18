// Troca de idioma (pt-BR / English) sem recarregar a pagina.
// Ordem de escolha: ?lang= na URL > escolha salva > idioma do navegador > ingles.
// Sem JavaScript, os dois idiomas aparecem: nenhum conteudo fica inacessivel.
(function () {
  var SUPPORTED = ["pt-BR", "en"];
  var KEY = "secretaria-lang";

  function fromUrl() {
    var value = new URLSearchParams(location.search).get("lang");
    if (!value) return null;
    return value.toLowerCase().indexOf("pt") === 0 ? "pt-BR" : value.toLowerCase() === "en" ? "en" : null;
  }

  function fromStorage() {
    try {
      var value = localStorage.getItem(KEY);
      return SUPPORTED.indexOf(value) >= 0 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function fromBrowser() {
    return (navigator.language || "").toLowerCase().indexOf("pt") === 0 ? "pt-BR" : "en";
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(function (element) {
      element.hidden = element.getAttribute("data-lang") !== lang;
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-set-lang") === lang));
    });
    // Links internos levam o idioma junto (vale mesmo se o navegador bloquear o localStorage).
    document.querySelectorAll("a[data-keep-lang]").forEach(function (link) {
      var url = new URL(link.getAttribute("href"), location.href);
      url.searchParams.set("lang", lang === "pt-BR" ? "pt" : "en");
      link.href = url.pathname.split("/").pop() + url.search + url.hash;
    });
    var title = document.querySelector("meta[name='title-" + lang + "']");
    if (title) document.title = title.content;
  }

  function choose(lang) {
    apply(lang);
    try {
      localStorage.setItem(KEY, lang);
    } catch (error) {
      // navegacao privada: a escolha so vale para esta visita
    }
    var url = new URL(location.href);
    url.searchParams.set("lang", lang === "pt-BR" ? "pt" : "en");
    history.replaceState(null, "", url);
  }

  apply(fromUrl() || fromStorage() || fromBrowser());

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      choose(button.getAttribute("data-set-lang"));
    });
  });
})();
