# Smart Talk AI Chat Implementation TODO

## Pending Tasks
- [x] 1. Create login page (app/login/page.tsx) with title, description, and auth buttons.
- [x] 2. Update SmartTalk.tsx to conditionally render login button or AI chat based on session.
- [x] 3. Create SmartTalkRoom.tsx (main chat component with real-time updates, filtered by user).
- [x] 4. Create SmartTalkAuth.tsx (login prompt for smart talk).
- [x] 5. Create SmartTalkInput.tsx (with cooldown mechanism).
- [x] 6. Create SmartTalkItem.tsx (bubble styling: user right neutral-700, AI left neutral-800).
- [x] 7. Create API routes: app/api/smart-talk/route.ts (GET/POST for user-filtered messages).
- [x] 8. Update sidebar: Add login/logout button in smart talk menu item, show user info when logged in.
- [x] 9. Integrate OpenRouter API service for AI responses.
- [x] 10. Add welcome message logic (AI sends personalized welcome on first visit).
- [x] 11. Create instructions file for env setup and database schema.

## Followup Steps
- [ ] Install any new dependencies (e.g., for OpenRouter).
- [ ] Test authentication flow.
- [ ] Test AI integration and cooldown.
- [ ] Verify real-time updates and private chat filtering.
- [ ] Ensure styling consistency with chat room.
