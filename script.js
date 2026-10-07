/**
 * script.js — ページの動き（コピー・チェックの保存・固定ボタン）
 * 文章は index.html を直接編集してください（content.js方式は使いません）。
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     設定値（ここだけ書き換えればOK）
     LINE_URL : CTAボタンの遷移先（空のままだとCTAボタンは表示されません）
  ------------------------------------------------------------ */
  const LINE_URL = "https://sub.aione.co.jp/line/open/ErxG3f10mmcK?mtid=8LTecV7UlNz5";
  /* 固定ボタンを出すスクロール量（画面の高さの何枚分か） */
  const STICKY_SHOW_SCREENS = 1;
  const PROGRESS_KEY = "claudework:progress";

  /* ------------------------------------------------------------
     コピー機能（クリップボードAPI／古いブラウザ向けの代替／失敗時は手動コピーを案内）
  ------------------------------------------------------------ */
  function legacyCopy(text) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (e) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }

  function selectText(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function showCopyStatus(btn, message) {
    const status = btn.closest(".prompt-box").querySelector(".copy-status");
    if (status) status.textContent = message;
  }

  function onCopyClick(e) {
    const btn = e.target.closest(".copy-btn[data-copy-target]");
    if (!btn) return;
    const target = document.getElementById(btn.getAttribute("data-copy-target"));
    if (!target) return;
    copyText(target.textContent).then((ok) => {
      if (!ok) {
        selectText(target);
        showCopyStatus(btn, "自動でコピーできませんでした。選択された文字を長押し（またはCtrl+C）でコピーしてください。");
        return;
      }
      showCopyStatus(btn, "");
      btn.classList.add("is-copied");
      window.clearTimeout(btn._copyTimeout);
      btn._copyTimeout = window.setTimeout(() => btn.classList.remove("is-copied"), 2200);
    });
  }

  /* ------------------------------------------------------------
     〈 〉で囲まれた「書き換える場所」を強調表示（コピーされる文字は変わらない）
  ------------------------------------------------------------ */
  function highlightFillIns() {
    document.querySelectorAll(".prompt-box__text").forEach((pre) => {
      const text = pre.textContent;
      pre.textContent = "";
      text.split(/(〈[^〉]*〉)/).forEach((part) => {
        if (part.startsWith("〈")) {
          const span = document.createElement("span");
          span.className = "fill";
          span.textContent = part;
          pre.appendChild(span);
        } else if (part) {
          pre.appendChild(document.createTextNode(part));
        }
      });
    });
  }

  /* ------------------------------------------------------------
     チェックの保存（localStorage。使えない環境でも操作は可能）と、件数の表示
  ------------------------------------------------------------ */
  function loadProgress() {
    try {
      return JSON.parse(window.localStorage.getItem(PROGRESS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(state) {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch (e) {
      /* 保存できない環境でも、チェック操作そのものは続けられる */
    }
  }

  function updateCounts() {
    document.querySelectorAll("[data-count-for]").forEach((counter) => {
      const prefix = counter.getAttribute("data-count-for");
      const checked = document.querySelectorAll('input[data-progress^="' + prefix + '"]:checked').length;
      counter.textContent = String(checked);
    });
  }

  function setupProgress() {
    const state = loadProgress();
    document.querySelectorAll("input[data-progress]").forEach((box) => {
      const key = box.getAttribute("data-progress");
      box.checked = state[key] === true;
      box.addEventListener("change", () => {
        state[key] = box.checked;
        saveProgress(state);
        updateCounts();
      });
    });
    updateCounts();
  }

  /* ------------------------------------------------------------
     スクロールで軽くフェードインする演出
  ------------------------------------------------------------ */
  function setupRevealAnimation() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------
     LINEリンクの設定（URLが空ならボタンは出さない。data-cta は将来の計測用）
  ------------------------------------------------------------ */
  function applyConfig() {
    if (!LINE_URL) return;
    document.querySelectorAll("[data-line-link]").forEach((link) => {
      link.setAttribute("href", LINE_URL);
      link.hidden = false;
    });
  }

  /* ------------------------------------------------------------
     画面下の固定ボタン：少しスクロールしたら表示／CTAが見えている間は隠す
  ------------------------------------------------------------ */
  function setupStickyCta() {
    const bar = document.querySelector(".sticky-cta");
    const ctas = ["cta-mid", "cta"].map((id) => document.getElementById(id)).filter(Boolean);
    if (!bar || ctas.length === 0) return;

    function isInView(el) {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function update() {
      const scrolledEnough = window.scrollY >= window.innerHeight * STICKY_SHOW_SCREENS;
      bar.classList.toggle("is-visible", scrolledEnough && !ctas.some(isInView));
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function init() {
    applyConfig();
    setupStickyCta();
    highlightFillIns();
    setupProgress();
    setupRevealAnimation();
    document.addEventListener("click", onCopyClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
