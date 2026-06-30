# Bir Kömək Design Specification

## Overview
This specification outlines the redesign of the main application dashboard into the **Bir Kömək** portal layout. It includes the updated home screen with quick-access emergency services grid, a custom bottom tab navigation panel, and a dedicated SOS detail page for activating alerts.

## 1. Main Dashboard (`app/(tabs)/index.js`)
- **Top Greeting Bar:** Displays user profile image, name ("Salam Rufat"), welcoming message ("Təkrar xoş gəldiniz 😊"), a document/medical card action button, and a notification bell with badge.
- **2x2 Grid of Emergency Services:**
  - **103 - Təcili Tibbi Yardım:** Pink/light red card with a high-quality 3D/illustrated ambulance graphic.
  - **102 - Polis / Təhlükəsizlik:** Blue card with a shield icon.
  - **112 - FHN / Yanğın:** Yellow/orange card with a fire station graphic.
  - **Ailə SOS:** Light purple card with an illustrated family icon under an umbrella.
- **Promo Banner:** Full-width card styled with "Onların təhlükəsizliyi bizim borcumuzdur! Bir toxunuşla qayğı və dəstək" and an image of an elderly couple.
- **Carousel Indicators:** Clean slider dots.

## 2. Custom Bottom Tab Layout (`app/(tabs)/_layout.js`)
- Replaces the standard tab layout with a custom curved panel:
  - Left button: Grid/Applications menu.
  - Center button: Large red circular "SOS" button representing earth/pulse graphics.
  - Right button: Microphone icon representing voice-assisted emergency search.

## 3. SOS Details Screen (`app/sos/[id].js`)
- Dynamic route showing status/controls for the clicked service:
  - Back navigation button and right-hand options menu.
  - Large service vector graphic matching the selected service type (103, 102, 112, or Ailə SOS).
  - Location sharing status box displaying current user address ("Bakı, Üzeyir Hacıbəyov küç., 34") with map pin indicator.
  - Switch/toggle for auto notifying family contacts ("Yaxınlarıma avtomatik məlumat ver").
  - Primary button: "Zəng et" (red button).
  - Secondary button: "Ləğv et" (white outlined button).
