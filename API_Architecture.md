# Syncaura API Integration & Architecture Documentation 🚀

This document serves as the guide for the **Syncaura Frontend** development team. It outlines the API architecture, communication flows, token management, error handling, and best practices for integrating the backend services.

---

## 📂 1. Folder Structure & Service-Layer Architecture

To maintain a clean separation of concerns, the API layer is modularized across configurations, state thunks, slices, and custom services:

```bash
src/
│
├── config/
│   └── axios.js            # Network Client: Axios instance with request/response interceptors
│
├── redux/
│   ├── features/
│   │   └── authThunks.js   # API Async Operations: Handles login, register, and refresh calls
│   │
│   ├── slices/
│   │   └── authSlice.js    # State Management: Stores user details, tokens, and loading states
│   └── store.js            # Redux Store: Combines all feature slices
│
├── services/
│   └── errorHandler.js     # Toast Notification & Error Processing Utility
│
├── constant/
│   └── validationRules.js  # Form Input Validation Schemas
│
└── pages/
    ├── SignIn.jsx          # Login view and form submission handlers
    └── SignUp.jsx          # Registration view and form submission handlers
```

---

## 🔐 2. Authentication Service & Token Management

User authentication in Syncaura uses **JSON Web Tokens (JWT)**. The token management system separates short-lived Access Tokens from long-lived Refresh Tokens to optimize security.

### A. Token Lifecycle and Storage
* **Access Token**: Placed in memory (Redux state) and mirrored in `localStorage` as `accessToken`. It expires quickly (e.g., 15 minutes) and is sent in the headers of all authenticated requests.
* **Refresh Token**: Stored securely in `localStorage` as `refreshToken`. It has a longer expiration window (e.g., 7 days) and is used exclusively to fetch a new access token when the current one expires.

### B. Network Request Interceptor
The request interceptor automatically attaches the current `accessToken` from local storage to the request headers, so developers do not need to attach tokens manually:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### C. Response Interceptor & Token Refresh Queue
When an API request fails with a `401 Unauthorized` status (indicating an expired access token), the response interceptor automatically pauses the request queue and attempts to refresh the access token:

1. **Locking & Queueing**: If multiple API calls fail simultaneously, the system locks the refreshing state (`isRefreshing = true`) and pushes subsequent failed requests into a retry queue (`failedQueue`).
2. **Access Token Refresh**: The interceptor sends a `POST` request to `/auth/refresh` using the `refreshToken`.
3. **Queue Processing**:
   * **Success**: The new access token is saved in `localStorage`, the defaults are updated, and all queued failed requests are re-sent with the new token.
   * **Failure**: If the refresh token has expired or is invalid, the interceptor clears all auth tokens, dispatches a custom `auth_session_expired` event (which logs the user out), and redirects them to the Sign In page.

---

## 🔄 3. Request and Response Flow

The diagram below illustrates the communication flow during an API transaction (e.g., submitting the Login or Register form):

```
┌──────────────┐         Validate Form          ┌─────────────────┐
│  Form Page   ├───────────────────────────────>│ ValidationRules │
│ (Sign In/Up) │                                └────────┬────────┘
└──────┬───────┘                                         │
       │                                     Passed      │
       │ Submit Payload                                  ▼
       │ (dispatch authThunk)                   ┌─────────────────┐
       ▼                                        │   authThunks    │
┌──────────────┐                                └────────┬────────┘
│  Redux Store ├─────────────────────────────────────────┼────────┐
└──────┬───────┘                                         │        │
       │ Update isLoading = true                         │        │
       │                                                 ▼        │
       │                                        ┌─────────────────┐       Attach Token
       │                                        │  Axios Client   │<─── Request Interceptor
       │                                        └────────┬────────┘
       │                                                 │
       │                                                 │ HTTP Request
       │                                                 ▼
       │                                        ┌─────────────────┐
       │                                        │   Backend API   │
       │                                        └────────┬────────┘
       │                                                 │
       │                                                 │ HTTP Response
       │                                                 ▼
       │                                        ┌─────────────────┐      Handle Expired Token
       │                                        │  Axios Client   │───> Response Interceptor
       │                                        └────────┬────────┘
       │                                                 │
       │                                       Resolved  │ Rejected
       ▼                                                 ▼
┌──────────────┐                                ┌─────────────────┐
│  authSlice   │<───────────────────────────────┤  errorHandler   │
└──────┬───────┘        Update Auth State       └────────┬────────┘
       │          (user, token, isLoading=false)          │
       │                                                 │ Trigger Toast
       ▼                                                 ▼
┌──────────────┐                                ┌─────────────────┐
│  Form Page   │<───────────────────────────────┤  Toast Notification
│  (Redirect)  │     Success Toast (Green)      │  Error Toast (Red)
└──────────────┘                                └─────────────────┘
```

---

## 🔄 4. Handling API Actions, Loading, and Errors

### A. Calling Endpoints from Pages
Always dispatch Redux thunks from forms to communicate with the API. Use `.unwrap()` to convert Redux actions into standard Javascript Promises so page-level `try/catch` statements can capture local outcomes:

```javascript
const onSubmit = async (data) => {
  try {
    const res = await dispatch(loginUser(data)).unwrap();
    handleSuccess(`Welcome Back ${res?.user?.name || "User"}!!`);
    navigate("/user-dashboard");
  } catch (err) {
    handleError(err || "Login failed");
  }
};
```

### B. Managing Loading States
To prevent duplicate form submissions and provide visual feedback to users, always disable submit buttons and display loaders using a combination of local form state (`isSubmitting`) and global store status (`isLoading`):

```javascript
const { isLoading } = useSelector((state) => state.auth);
const { formState: { isSubmitting } } = useForm();

const isPending = isSubmitting || isLoading;

<button type="submit" disabled={isPending}>
  {isPending ? <Loader className="animate-spin" /> : "Submit"}
</button>
```

### C. Standardized Error Handling
Errors are routed through a central `handleError` service, which parses HTTP status codes and API error response payloads:

* **500 Server Errors**: Displays `"Internal Server Error (500). Please try again later."`
* **404 Resource Missing**: Displays `"Requested resource not found (404)."`
* **403 Forbidden**: Displays `"You do not have permission to perform this action (403)."`
* **Network Failures**: Displays `"Network error. Please check if the backend server is running."`
* **Backend Custom Errors**: Displays the message sent directly by the backend controllers (e.g. `"User already exists"` or `"Invalid email or password"`).

---

## 💡 5. Best Practices for the Development Team

1. **Keep Secrets Secret**: Never hardcode database credentials, ports, or API endpoints in source files. Use environment variables instead.
2. **Always Use the Axios Client**: Avoid calling plain `axios` directly in pages. Use the configured `api` wrapper import from `src/config/axios.js` to ensure request headers and automatic token refresh interceptors are applied.
3. **Form Validations First**: Do not send requests to the server if the user inputs are invalid. Let the frontend `validationRules` catch formatting issues locally to save network bandwidth.
4. **Never Ignore Catch Blocks**: Always wrap API thunk calls in `try/catch` blocks and hand exceptions to `handleError(err)`.
5. **Handle User Feedback**: Every write operation (creating, editing, deleting) must display a clear success or failure Toast notification upon completion to verify the action.
