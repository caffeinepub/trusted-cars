# Specification

## Summary
**Goal:** Fix the Admin Login page so it no longer requires an admin token in the URL to allow login, removing the blocking error message and enabling direct credential-based authentication.

**Planned changes:**
- Remove the URL token presence check that blocks form submission on the `/admin` login page
- Remove the "Admin token not configured. Please access the admin panel via the correct URL with the admin token." error message
- Update the `adminLogin` mutation call to trigger directly on form submit without a token gate check
- Audit and fix the `useAdminActor` hook so the admin actor is initialized using the session returned from `adminLogin`, not a URL parameter
- Ensure that after a successful login, admin operations (e.g., `addCar`) work without any token-related errors

**User-visible outcome:** Navigating to `/admin` shows a clean login form with no pre-displayed error. Submitting valid credentials logs the admin in and redirects to `/admin/dashboard` without any token-related errors.
