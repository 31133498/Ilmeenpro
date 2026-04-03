# Ilmeen Major Upgrade TODO

## Plan Status: Initial [PENDING APPROVAL]

**Information Gathered:**
- Current App.tsx: simple Screen='main|sessions|quiz' state, overlays for screens, stage='idle|ocr|translating|done|error' for pipeline.
- OCR in services/ocr.ts (streaming ready via OpenAI).
- Reader (TextViewer.tsx) has focusMode, memorized lines, loop, font size.
- SessionsScreen exists with swipe-delete.
- No router/stack, no contentType detection, no progressive rendering.
- LocalStorage sessions with image base64 (need compression).
- Mobile bottom nav exists.

**Plan:**
1. **NavigationContext** (src/contexts/NavigationContext.tsx)
   - state: navigationStack: {screen, params}[] 
   - push(screen, params), pop(), replace(screen)
   - Wrap App in provider.
2. **Update App.tsx** 
   - Use NavigationContext instead of screen/stage state.
   - Screens: Home (landing? ), Scan (upload+processing), Reader, Sessions, SessionDetail.
3. **Streaming OCR** (services/ocr.ts)
   - GPT-4o streaming, parse incremental JSON for raw/diacritized/contentType.
4. **Content-aware Reader** (TextViewer.tsx or new ContentRenderer.tsx)
   - poem: centered lines, stanza dividers, bayt pairs.
   - prose: justify, drop caps.
   - table: HTML table, cell hover/TTS.
   - list: styled list.
5. **Performance** 
   - useRef for audio, debounce tooltip.
   - Image compression canvas.
   - localStorage quota handler.
6. **Typography** prefs localStorage per contentType.
7. **Loading** cascading chars animation.
8. Desktop sidebar.

**Dependent Files:**
- src/App.tsx (major rewrite)
- src/contexts/NavigationContext.tsx (new)
- src/services/ocr.ts (streaming)
- src/components/ContentRenderer.tsx (new)
- src/components/TextViewer.tsx (refactor)
- src/components/Sidebar.tsx (new, desktop)
- src/services/storage.ts (image compression)

**Followup steps:**
- npm run dev test each step.
- Verify streaming feels instant.
- Test content types with sample images.
- localStorage quota handling.

