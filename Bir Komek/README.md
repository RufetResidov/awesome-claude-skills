# Antigravity UX/UI Handoff Master Template

## Purpose
This template standardizes Designer → Frontend → Backend → QA handoff.

## Deliverables
- README.md
- Design-System.md
- UX-Documentation.md
- Frontend-Handoff.md
- Backend-Handoff.md
- QA-Checklist.md
- index.html
- styles.css
- assets/

## Design Tokens
Use CSS custom properties:
```css
:root{
 --color-primary:#3D5AFE;
 --font-base:'Inter',system-ui,sans-serif;
 --space-8:.5rem;
 --radius-md:12px;
}
```

## Required Sections
### UX Analysis
- Goal
- User Flow
- Edge Cases
- Empty State
- Loading State
- Error State
- Accessibility

### Design System
- Colors
- Typography
- Spacing
- Radius
- Shadows
- Grid
- Breakpoints

### HTML
Use semantic elements:
header, nav, main, section, article, aside, footer, form, label, button, ul/li, dialog, figure, picture.

### Responsive
- Mobile: 320–767
- Tablet: 768–1023
- Desktop: 1024+

Use Grid + Flexbox, rem/clamp(), max-width and percentage containers.

### Accessibility
- alt text
- aria-label
- keyboard navigation
- WCAG contrast
- focus states

### Assets
Priority:
1. Original
2. SVG/WebP
3. Font Awesome v6
4. Material Icons
5. Unsplash placeholders

### Frontend
Recommended folders:
src/
 assets/
 components/
 pages/
 hooks/
 services/
 api/
 utils/
 styles/

### Backend
Document:
- Endpoints
- Request
- Response
- Validation
- Auth
- Errors

### QA Checklist
- Responsive
- Pixel Perfect
- Accessibility
- States
- API
- Performance

### Rules
- CSS Variables for all tokens.
- BEM naming.
- srcset/sizes for images.
- Hover, Focus, Active, Disabled states.
- Clean semantic HTML.
# Antigravity Projesi Tasarım-Kod Transfer Protokolü (Handoff Template)

Bu döküman, **Antigravity** bünyesinde geliştirilecek olan projelerde (Web ve Mobil/React tabanlı) Tasarım (UX/UI), Ön Yüz/Mobil (Frontend), Arka Yüz (Backend) ve Test (QA) ekipleri arasındaki entegrasyonu, standartları ve kod transfer (handoff) sürecini otomatize etmek ve eşzamanlamak için hazırlanmış bir master şablondur[cite: 1].

---

## 1. TEMEL KURALLAR VE MİMARİ STANDARTLAR

### 1.1. Tasarım Token'ları & CSS Değişkenleri (Custom Properties)
Tasarımda tanımlanan tüm atomik değerler (renk, tipografi, boşluk, yuvarlatma, gölge) CSS değişkeni olarak export edilmelidir[cite: 1].

```css
:root {
  /* --- Renk Paleti (Color Palette) --- */
  --color-primary: #111111;
  --color-primary-rgb: 17, 17, 17;
  --color-accent: #00E5FF;
  --color-accent-hover: #00B2CC;
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text-main: #1F2937;
  --color-text-muted: #4B5563;
  --color-border: #E5E7EB;
  --color-error: #EF4444;
  --color-success: #10B981;

  /* --- Boşluk Sistemi (Spacing System - 8px Grid tabanlı) --- */
  --space-2: 0.125rem;  /* 2px */
  --space-4: 0.25rem;   /* 4px */
  --space-8: 0.5rem;    /* 8px */
  --space-12: 0.75rem;  /* 12px */
  --space-16: 1rem;     /* 16px */
  --space-24: 1.5rem;   /* 24px */
  --space-32: 2rem;     /* 32px */
  --space-48: 3rem;     /* 48px */
  --space-64: 4rem;     /* 64px */

  /* --- Tipografi Ölçüleri (Fluid Typography) --- */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-heading: 'Plus Jakarta Sans', -apple-system, sans-serif;
  
  /* Responsive yazı boyutları için clamp() kullanımı */
  --font-size-xs: clamp(0.7rem, 0.65rem + 0.2vw, 0.75rem);
  --font-size-base: clamp(0.9rem, 0.85rem + 0.22vw, 1rem);
  --font-size-md: clamp(1.05rem, 1rem + 0.25vw, 1.15rem);
  --font-size-lg: clamp(1.25rem, 1.15rem + 0.4vw, 1.4rem);
  --font-size-xl: clamp(1.5rem, 1.35rem + 0.6vw, 1.75rem);
  --font-size-h2: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
  --font-size-h1: clamp(2.25rem, 1.85rem + 1.6vw, 3rem);

  /* --- Sınırlar ve Gölgeler (Border Radius & Shadows) --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* --- Geçiş Efektleri (Transitions) --- */
  --transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```[cite: 1]

### 1.2. Semantik HTML & Yapısal Eşleme
Geliştirilen arayüzlerde `<div>` enflasyonunun önüne geçilecek ve tarayıcı/ekran okuyucu uyumu için semantik etiketler kullanılacaktır[cite: 1]:
- **Üst Alan:** `<header>` ve `<nav>`[cite: 1]
- **Ana İçerik:** `<main>`[cite: 1]
- **Bağımsız Bölümler:** `<section>` (Her section mutlaka bir başlık içermelidir)[cite: 1]
- **Bağımsız Dağıtılabilir İçerik:** `<article>`[cite: 1]
- **Etkileşim Elementleri:** `<button>`, `<a href="...">`, `<form>`, `<label>`, `<input>`, `<select>`[cite: 1]
- **Listeler:** `<ul>`, `<li>`, `<ol>`[cite: 1]

### 1.3. Responsive Tasarım & Layout Prensipleri
- **Flexbox ve Grid:** Sayfa ana iskeleti için `display: grid`, bileşen içi hizalamalar için `display: flex` tercih edilmelidir[cite: 1].
- **Container Yönetimi:** Sabit piksel genişlikleri yerine genişlik için `%` veya `vw`, sınırlama için `max-width` kullanılmalıdır[cite: 1].
- **Dönüşüm Davranışı:** Piksel mükemmelliği (pixel-perfect) masaüstü görünümleri responsive yapıda oransal kırılımlara uğrar[cite: 1]. Masaüstünde yan yana (inline) duran elemanlar, mobilde dikey düzlemde üst üste (stacked) listelenir[cite: 1].

### 1.4. Erişilebilirlik (Accessibility - A11y)
- Tüm `<img>` etiketlerinde açıklayıcı ve anlamlı `alt` niteliği zorunludur[cite: 1]. Dekoratif görseller için `alt=""` bırakılmalıdır[cite: 1].
- Metin içermeyen, sadece ikon barındıran buton ve linklerde `aria-label` kullanımı zorunludur[cite: 1].
- Renk kontrast oranı WCAG AA standartlarına (en az 4.5:1) uygun olmalıdır[cite: 1].
- Odaklanma durumları (`:focus`, `:focus-visible`) için tarayıcı default outline'ı yerine markaya uygun belirgin bir stil atanmalıdır[cite: 1].

### 1.5. Fallback (Geri Çekilme) ve Kaynak Kuralları
- **İkon Fallback:** Projelerde öncelikle UI Designer tarafından dışa aktarılan özel SVG ikonlar kullanılır[cite: 1]. Otomatik veya anlık ikon ihtiyacında **Font Awesome (v6)** kütüphanesi çağrılır[cite: 1]. Eğer aranan ikon burada bulunamazsa **Google Material Icons** kitaplığına fallback yapılır[cite: 1].
- **Font Fallback:** Özel font yüklenemediği durumlarda sistem, Google Fonts üzerinden belirlenen en yakın fontu çeker[cite: 1]. O da başarısız olursa sistem fontlarına (`-apple-system`, `BlinkMacSystemFont`, `sans-serif`) geri döner[cite: 1].
- **Görsel Fallback (Placeholder):** Gerçek üretim görsellerinin eksikliğinde, içeriğin bağlamına uygun yüksek kaliteli **Unsplash** URL'leri yer tutucu olarak atanır[cite: 1].

---

## 2. KODLAMA DETAYLARI VE UYGULAMA ÖRNEKLERİ

### 2.1. Semantik ve Temiz `index.html` Yapısı

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Antigravity Project Template</title>
  <!-- Google Fonts Fallback -->
  <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
  <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
  <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700&display=swap)" rel="stylesheet">
  <!-- Font Awesome v6 Fallback -->
  <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)">
  <!-- Material Icons Fallback -->
  <link href="[https://fonts.googleapis.com/icon?family=Material+Icons](https://fonts.googleapis.com/icon?family=Material+Icons)" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Semantik Header ve Navigasyon -->
  <header class="header">
    <div class="header__container">
      <a href="#" class="header__logo" aria-label="Antigravity Ana Sayfa">
        <svg class="icon icon--logo" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Antigravity</span>
      </a>
      <nav class="header__nav" aria-label="Ana Menü">
        <ul class="header__menu">
          <li class="header__item"><a href="#" class="header__link header__link--active">Layihelere</a></li>
          <li class="header__item"><a href="#" class="header__link">Ekibimiz</a></li>
          <li class="header__item"><a href="#" class="header__link">Elaqe</a></li>
        </ul>
      </nav>
      <div class="header__actions">
        <button class="btn btn--icon" aria-label="Arama Yap">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button class="btn btn--primary">Başla</button>
      </div>
    </div>
  </header>

  <!-- Ana İçerik Alanı -->
  <main class="main-content">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__container">
        <div class="hero__body">
          <h1 id="hero-title" class="hero__title">Geleceğin Dijital Ürünlerini Tasarlıyoruz</h1>
          <p class="hero__description">Fikirleri kullanıcı odaklı arayüzlere ve yüksek performanslı React tabanlı uygulamalara dönüştürüyoruz.</p>
          <div class="hero__cta">
            <button class="btn btn--primary btn--large">Projeleri Keşfet</button>
            <button class="btn btn--secondary btn--large">
              <span class="material-icons">play_circle</span>
              Videoyu İzle
            </button>
          </div>
        </div>
        <div class="hero__media">
          <picture>
            <source srcset="[https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80](https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80)" media="(min-width: 1024px)">
            <source srcset="[https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80](https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80)" media="(min-width: 768px)">
            <img src="[https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80](https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80)" 
                 alt="Antigravity Tasarım Ekibi Çalışma Alanı - Unsplash Yer Tutucu" 
                 class="hero__img" 
                 loading="lazy">
          </picture>
        </div>
      </div>
    </section>

    <!-- Grid Kart Yapısı Listesi -->
    <section class="cards-section" aria-labelledby="section-title">
      <div class="cards-section__container">
        <h2 id="section-title" class="cards-section__title">Hizmet Alanlarımız</h2>
        <div class="cards-grid">
          
          <article class="card">
            <div class="card__icon-wrapper">
              <i class="fa-solid fa-palette"></i>
            </div>
            <h3 class="card__title">UX/UI Tasarım</h3>
            <p class="card__text">Figma ve Framer ile zenginleştirilmiş, kullanıcı deneyimi yüksek prototipler ve kapsamlı tasarım sistemleri.</p>
          </article>

          <article class="card card--featured">
            <div class="card__icon-wrapper">
              <i class="fa-solid fa-code"></i>
            </div>
            <h3 class="card__title">React & Mobile</h3>
            <p class="card__text">Web ve mobil platformlar için optimize edilmiş temiz, modüler ve performans odaklı ön yüz kodları.</p>
          </article>

          <article class="card">
            <div class="card__icon-wrapper">
              <span class="material-icons">storage</span>
            </div>
            <h3 class="card__title">Sağlam Arka Yüz</h3>
            <p class="card__text">Güvenli, ölçeklenebilir veritabanı mimarileri ve yüksek erişilebilirlikli API servisleri.</p>
          </article>

        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>&copy; 2026 Antigravity. Bütün hüquqlar qorunur.</p>
  </footer>

</body>
</html>
```[cite: 1]

### 2.2. Modüler ve BEM Uyumlu `styles.css` Yapısı

```css
/* ==========================================================================
   1. RESET & BASE STYLES
   ========================================================================== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: 1.5;
  background-color: var(--color-background);
  color: var(--color-text-main);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  color: var(--color-primary);
  font-weight: 700;
  line-height: 1.2;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition-fast);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* ==========================================================================
   2. COMPONENT STYLES (BEM Mimarisi)
   ========================================================================== */

/* --- Button Component & States --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  font-family: var(--font-family-base);
  font-weight: 500;
  font-size: var(--font-size-base);
  padding: var(--space-8) var(--space-16);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-surface);
}

.btn--primary:hover:not(:disabled) {
  background-color: rgba(var(--color-primary-rgb), 0.85);
  transform: translateY(-1px);
}

.btn--primary:active {
  transform: translateY(0);
}

.btn--primary:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.btn--secondary {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-background);
  border-color: var(--color-primary);
}

.btn--icon {
  background: transparent;
  border: none;
  padding: var(--space-8);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
}

.btn--icon:hover {
  background-color: var(--color-border);
  color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* --- Header Component --- */
.header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.header__menu {
  display: flex;
  gap: var(--space-24);
}

.header__link {
  color: var(--color-text-muted);
  font-weight: 500;
}

.header__link:hover, .header__link--active {
  color: var(--color-accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

/* --- Hero Component --- */
.hero {
  padding: var(--space-48) 0;
}

.hero__container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-32);
  align-items: center;
}

.hero__title {
  font-size: var(--font-size-h1);
  margin-bottom: var(--space-16);
}

.hero__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-24);
}

.hero__cta {
  display: flex;
  gap: var(--space-16);
}

.hero__img {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

/* --- Card Component & Grid --- */
.cards-section {
  padding: var(--space-64) 0;
  background-color: var(--color-surface);
}

.cards-section__container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.cards-section__title {
  font-size: var(--font-size-h2);
  text-align: center;
  margin-bottom: var(--space-48);
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-24);
}

.card {
  padding: var(--space-32);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.card--featured {
  border: 2px solid var(--color-primary);
  background-color: #FFFDF9;
}

.card__icon-wrapper {
  font-size: var(--font-size-xl);
  color: var(--color-accent);
  margin-bottom: var(--space-16);
}

.card__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-12);
}

.card__text {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}

.footer {
  text-align: center;
  padding: var(--space-32);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

/* ==========================================================================
   3. RESPONSIVE BREAKPOINTS (Media Queries)
   ========================================================================== */

/* Tablet ve Üzeri (Kırılma Noktası: 768px) */
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero__container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Masaüstü Ekranlar (Kırılma Noktası: 1024px) */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .header__container {
    height: 80px;
  }
}
```[cite: 1]

---

## 3. EKİP ÖZELİNDEKİ GÖREVLER VE TESLİMAT SÜREÇLERİ

### 3.1. UI / UX Designer (Tasarım Ekibi)
- **Tokenizasyon:** Tasarıma başlamadan önce Figma / Framer üzerinde renk, tipografi, grid ve boşluk (spacing) stillerini dökümandaki CSS isimlendirmelerine paralel olacak şekilde isimlendirin[cite: 1].
- **Varlık (Asset) Yönetimi:** Tüm görselleri sıkıştırılmış formatta (WebP veya optimize edilmiş PNG/JPEG), ikonları ise temiz kodlu SVG olarak ihraç edin[cite: 1].
- **Durum Tasarımları:** Elementlerin sadece durağan hallerini değil; `:hover`, `:active`, `:focus`, `:disabled` ve boş durum (empty state) görünümlerini tasarlayın[cite: 1].

### 3.2. Frontend / Mobile Developer (Ön Yüz Ekibi)
- **Yapılandırma:** Projeye başlarken `styles.css` içerisindeki `:root` değişkenlerini UI Designer'ın belirlediği token'lar ile güncelleyin[cite: 1].
- **React Yapısı:** HTML şablonundaki BEM sınıflarını React bileşen yapısına (`App.js`, `Component.jsx`) aktarırken CSS modülleri veya Styled Components kullanıyorsanız adlandırma sadakatini koruyun[cite: 1].
- **Erişilebilirlik:** `aria-label`, `alt` etiketleri ve klavye navigasyonu için `focus-visible` ayarlarını eksiksiz uygulayın[cite: 1].
- **Responsive Yönetimi:** Tasarımın masaüstü inline yapısını mobilde stacked modeline taşımak için CSS Grid/Flexbox medya sorgularını (`@media`) esnetmeden uygulayın[cite: 1].

### 3.3. Backend Developer (Arka Yüz Ekibi)
- **Veri Yapıları:** Arayüz bileşenlerinin (Örn: Card listeleri, Hero metinleri) dinamik içerik ihtiyacını karşılayacak veritabanı şemalarını kurgulayın[cite: 1].
- **API Standardı:** Ön yüzün performanslı çalışabilmesi için görsellerin responsive url listelerini (`srcset` karşılığı olan farklı boyut varyasyonlarını) dönecek şekilde medya servisleri hazırlayın[cite: 1].
- **Validasyon:** Form alanlarından gelen verilerin (HTML form elementleri) arka yüzdeki doğrulama kriterleri ile tam uyumlu olmasını sağlayın[cite: 1].

### 3.4. QA Tester (Test Ekibi)
- **Piksel Yakınlığı Testi:** Mobil, tablet ve masaüstü görünümlerinin, tasarım dosyasındaki oranlara ve yerleşime (stacked/inline dönüşümleri) uygunluğunu doğrulayın[cite: 1].
- **Erişilebilirlik Denetimi:** Lighthouse veya benzeri araçlarla kontrast oranlarını, semantik etiket doğruluğunu ve eksik `alt`/`aria-label` parametrelerini raporlayın[cite: 1].
- **Etkileşim Testi:** Formların, buton durumlarının (`disabled`, `loading`) ve tüm hover/focus aksiyonlarının beklendiği gibi çalışıp çalışmadığını fonksiyonel olarak test edin[cite: 1].

---

## 4. PROJE ASSET LİSTESİ VE YER TUTUCU URL'LERİ

Gerçek üretim asset'leri yüklenene kadar kullanılacak yüksek kaliteli kaynaklar[cite: 1]:

| Asset Tipi | Açıklama / Kullanım Alanı | Kaynak / URL Temsili |
| :--- | :--- | :--- |
| **Font (Base)** | Gövde Metinleri (Inter) | `https://fonts.google.com/specimen/Inter` |
| **Font (Heading)**| Başlıklar (Plus Jakarta Sans) | `https://fonts.google.com/specimen/Plus+Jakarta+Sans` |
| **İkon Seti 1** | Genel Arayüz İkonları | Font Awesome v6 (`cdnjs.com`) |
| **İkon Seti 2** | Fallback Sistem İkonları | Google Material Icons |
| **Görsel (Hero)** | Ana Karşılama Görseli (Teknoloji/Ofis) | `https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80` |
| **Görsel (Card)** | Hizmet İçerik Görseli | `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80` |