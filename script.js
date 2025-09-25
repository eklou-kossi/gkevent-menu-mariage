// Script principal — Gold Kitchen (GK Event)
// - Précharge le logo
// - Injecte les bonnes images (logo + menu) en détectant l'extension disponible
// - Gère les actions: téléchargement du menu, CTA WhatsApp

(function () {
  const ASSETS = {
    // Utilise les fichiers fournis par le client (même dossier que index.html)
    // Si le logo n'est pas .jpg chez vous, remplacez l'extension ci-dessous par celle du fichier.
    logoPrimary: 'Gold_kitchen_logo_update_fond_noir.jpg',
    menuPrimary: 'AS_Wedding_Menu_version_finale.jpg'
  };

  const CANDIDATE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

  const qs = (sel) => document.querySelector(sel);

  const els = {
    preloader: qs('#preloader'),
    preloaderLogo: qs('#preloader-logo'),
    brandLogo: qs('#brand-logo'),
    menuImg: qs('#menu-image'),
    downloadBtn: qs('#download-menu'),
    whatsappBtn: qs('#whatsapp-cta'),
    year: qs('#year')
  };

  // Utilitaire: teste une URL d'image en effectuant un HEAD, tombe ensuite en Image() pour fallback
  async function pickExistingImageUrl(primaryPath, optionalBaseWithoutExt) {
    // 1) Essaye le fichier primaire explicitement nommé (avec extension)
    if (primaryPath) {
      const okPrimary = await checkImage(primaryPath);
      if (okPrimary) return primaryPath;
    }
    // 2) Si un baseName est fourni, tente plusieurs extensions
    if (optionalBaseWithoutExt) {
      for (const ext of CANDIDATE_EXTS) {
        const url = `${optionalBaseWithoutExt}${ext}`;
        const ok = await checkImage(url);
        if (ok) return url;
      }
    }
    return null;
  }

  function checkImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function hidePreloader() {
    requestAnimationFrame(() => {
      els.preloader.classList.add('is-hidden');
    });
  }

  function setYear() {
    if (els.year) els.year.textContent = String(new Date().getFullYear());
  }

  async function initImages() {
    // Logo dans le preloader et dans le header
    const logoUrl = await pickExistingImageUrl(ASSETS.logoPrimary, 'Gold_kitchen_logo_update_fond_noir');
    if (logoUrl) {
      els.preloaderLogo.src = logoUrl;
      els.brandLogo.src = logoUrl;
      els.brandLogo.decoding = 'async';
      els.brandLogo.loading = 'eager';
    }

    // Image du menu
    const menuUrl = await pickExistingImageUrl(ASSETS.menuPrimary, 'AS_Wedding_Menu_version_finale');
    if (menuUrl) {
      els.menuImg.src = menuUrl;
      els.menuImg.loading = 'lazy';
      els.downloadBtn.href = menuUrl;
      // Ajoute un nom de fichier propre au téléchargement
      const dlName = menuUrl.split('/').pop();
      if (dlName) els.downloadBtn.setAttribute('download', dlName);
    } else {
      // Cas extrême: pas d'image trouvée
      els.menuImg.alt = "Menu indisponible pour le moment";
    }
  }

  function initWhatsapp() {
    // Renseignez ici le numéro WhatsApp au format international, sans + ni espaces.
    const whatsappNumber = '22898855085'; // TODO: à remplacer par le numéro réel
    const defaultMessage = encodeURIComponent("Bonjour Gold Kitchen, j'aimerais en savoir plus pour un évènement.");
    const url = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;
    els.whatsappBtn.href = url;
  }

  async function boot() {
    setYear();
    await initImages();
    initWhatsapp();
    // Laisse une petite tempo pour une transition fluide
    setTimeout(hidePreloader, 300);
  }

  // Démarre après le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


