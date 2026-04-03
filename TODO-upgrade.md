# Ilmeen Major Upgrade Plan

**Status: Approved - Proceed**

**Step 1: NavigationContext** - COMPLETED (created, main.tsx wrapped)

**Step 2: Audio saved in sessions** [COMPLETED ✅]
- Session interface +audio base64
- Generate + save full text audio in handleFile

**Step 3: Update App.tsx to stack navigation** [PENDING]

- useNavigation()
- Replace screen/stage with stack push/pop
- Map screens: home=ImageUploader, scan=progressive, reader=TextViewer+controls, sessions=SessionsScreen, session-detail=Reader with loaded ID

**Step 3: Streaming OCR** [PENDING]
- services/ocr.ts: GPT-4o stream parse JSON incremental
- Detect contentType

**Step 4: ContentRenderer** [PENDING]
- New component for poem/prose/table/list rendering

**Step 5: Desktop Sidebar** [PENDING]

**Step 6: Progressive UI** [PENDING]
- Show image immediately, status, cascade chars, raw then diacritized then translations

Next step ready.

