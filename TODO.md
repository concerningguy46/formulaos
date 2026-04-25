# TODO - Simple Username + Password Auth

## Steps

- [x] 1. UPDATE server/models/User.js - Replace schema with username + password only
- [x] 2. UPDATE server/controllers/authController.js - Replace with username-based auth
- [x] 3. UPDATE server/routes/auth.js - Remove Google OAuth routes
- [x] 4. UPDATE server/middleware/auth.js - Simplify to protect only
- [x] 5. UPDATE server/config/passport.js - Disable Google OAuth
- [x] 6. UPDATE client/src/pages/LoginPage.jsx - Username + password only, remove Google
- [x] 7. UPDATE client/src/pages/RegisterPage.jsx - Username + password only, remove Google
- [x] 8. UPDATE client/src/services/authService.js - username/password params, remove Google refs
- [x] 9. UPDATE client/src/store/authStore.js - Fix function signatures and destructuring for new API response format
- [x] 10. git add, commit, push

