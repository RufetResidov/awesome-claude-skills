# Bir Kömək Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Bir Kömək" emergency services dashboard UI, including custom curved bottom tab navigation and a detailed SOS activation screen with toggles and location details.

**Architecture:** We use Expo Router to structure navigation. The home dashboard renders in `app/(tabs)/index.js`. The curved bottom tab is configured in `app/(tabs)/_layout.js`. The SOS details page is set up as a dynamic route in `app/sos/[id].js`.

**Tech Stack:** React Native, Expo Router, Expo Vector Icons (@expo/vector-icons), React Native SafeAreaContext.

## Global Constraints
- Target platform: iOS and Android (via React Native/Expo).
- Use TailwindCSS only if explicitly requested; otherwise, use vanilla StyleSheet. Create clean, responsive styles using StyleSheet.
- File references: Clickable absolute file:// links to all touched resources.

---

### Task 1: Redesign the Main Dashboard
**Files:**
- Modify: `app/(tabs)/index.js`

**Interfaces:**
- Consumes: User name, custom assets or vector icons from `@expo/vector-icons` (Ionicons, MaterialCommunityIcons).
- Produces: The main dashboard interface containing the Greeting bar, 4 emergency grid items (103, 102, 112, Ailə SOS), and a promotional/info banner at the bottom.

- [ ] **Step 1: Write the updated Dashboard UI**
  Modify `app/(tabs)/index.js` to implement the header greeting ("Salam Rufat"), 4 emergency cards (103, 102, 112, Ailə SOS) with distinct colors, titles, subtitles, and vector illustrations.
- [ ] **Step 2: Add styles for Dashboard UI**
  Add styles to `app/(tabs)/index.js` matching the design: light backgrounds for cards, structured typography, rounded card layout, and bottom promotional banner.
- [ ] **Step 3: Run the app and verify rendering**
  Run visual validation to ensure the dashboard loads successfully without errors.
- [ ] **Step 4: Commit**
  ```bash
  git add app/\(tabs\)/index.js
  git commit -m "feat: implement Bir Komek dashboard UI"
  ```

---

### Task 2: Implement the Custom Bottom Navigation Bar
**Files:**
- Modify: `app/(tabs)/_layout.js`

**Interfaces:**
- Consumes: expo-router tab navigation config.
- Produces: Custom curved bottom tab bar layout displaying the Application Menu button on the left, Earth SOS button in the center, and Voice Assistant button on the right.

- [ ] **Step 1: Update TabLayout layout bar**
  Replace standard layout options in `app/(tabs)/_layout.js` to show custom grid menu, globe-styled center SOS button, and microphone icon.
- [ ] **Step 2: Add styles for custom tab bar**
  Add styles to `app/(tabs)/_layout.js` to position the center button elevated with standard shadow and circular border.
- [ ] **Step 3: Verify navigation bar rendering**
  Ensure tabs display correctly on screen.
- [ ] **Step 4: Commit**
  ```bash
  git add app/\(tabs\)/_layout.js
  git commit -m "feat: design custom curved bottom tab bar navigation"
  ```

---

### Task 3: Create SOS Details Screen
**Files:**
- Create: `app/sos/[id].js`

**Interfaces:**
- Consumes: `id` parameter from expo-router representing emergency code (103, 102, 112, or Ailə SOS).
- Produces: Detail view displaying back action button, selected emergency icon, shared location box, close contact notification toggle, and "Zəng et" / "Ləğv et" buttons.

- [ ] **Step 1: Create SOS details route**
  Create the folder `app/sos` and the file `app/sos/[id].js`.
- [ ] **Step 2: Add UI and styling for details view**
  Add components for back button, main 3D/illustrated icon, map location banner with custom fallback address, switch toggle, calling button, and cancel outline button.
- [ ] **Step 3: Verify transition from Dashboard**
  Click a grid item on the Dashboard and confirm transition to the detail route (`app/sos/[id].js`) with matching text and visual content.
- [ ] **Step 4: Commit**
  ```bash
  git add app/sos/\[id\].js
  git commit -m "feat: create emergency SOS details screen"
  ```
