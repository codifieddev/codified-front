# KalpAuth Architecture (`store -> kalpauth`)

## Folder structure

```text
src/
  redux/
    slices/
      kalpauth/
        kalpauthType.ts         # TypeScript types for Kalp auth entities
        kalpauthThunk.ts        # API thunks (login/session/refresh/logout)
        kalpauthSlice.ts        # Redux slice + state transitions
```

## Types (`kalpauthType.ts`)

```ts
export interface KalpAuthUser {
  id: string;
  email: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  tenant_id: string;
  agency_id: string | null;
  isTenantOwner: boolean;
  addresses: any;
  wishlist: any;
}

export interface KalpLoginResponse {
  access_token: string;
  expires_at: string;
  session: KalpAuthUser;
}

export interface KalpAuthState {
  isAuthenticated: boolean;
  token: string | null;
  authUser: KalpAuthUser | null;
  loading: boolean;
  error: string | null;
}
```

## Thunks (`kalpauthThunk.ts`)

| Thunk | Action | Description |
|-------|--------|-------------|
| `loginUser` | `kalpauth/loginUser` | Authenticate via email/password, store token in localStorage |
| `checkSession` | `kalpauth/checkSession` | Validate stored token against `/auth/me`, hydrate user |
| `refreshToken` | `kalpauth/refreshToken` | Refresh access token before expiry |
| `logoutUser` | `kalpauth/logoutUser` | Clear token from localStorage, reset state |

### `loginUser`

```ts
export const loginUser = createAsyncThunk(
  'kalpauth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const data = await fetcher<KalpLoginResponse>(`${api}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('kalp_access_token', data.access_token);
    return data;
  }
);
```

### `checkSession`

```ts
export const checkSession = createAsyncThunk(
  'kalpauth/checkSession',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('kalp_access_token');
    if (!token) return rejectWithValue('No token found');
    const user = await fetcher<KalpAuthUser>(`${api}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { token, user };
  }
);
```

## Slice (`kalpauthSlice.ts`)

### Initial state

```ts
const initialState: KalpAuthState = {
  isAuthenticated: false,
  token: null,
  authUser: null,
  loading: false,
  error: null,
};
```

### Sync reducers

| Action | Payload | Effect |
|--------|---------|--------|
| `setAuth` | `KalpLoginResponse` | Mark authenticated, set token/user |
| `logout` | none | Clear all state + localStorage |
| `clearError` | none | Reset `error` to null |

### Extra reducers (async thunk lifecycle)

| Thunk stage | State changes |
|-------------|---------------|
| `loginUser.pending` | `loading = true, error = null` |
| `loginUser.fulfilled` | `loading = false, isAuthenticated = true, token = payload.access_token, authUser = payload.session` |
| `loginUser.rejected` | `loading = false, error = payload` |
| `checkSession.pending` | `loading = true` |
| `checkSession.fulfilled` | `loading = false, isAuthenticated = true, token = payload.token, authUser = payload.user` |
| `checkSession.rejected` | `loading = false, isAuthenticated = false, token = null, authUser = null` |

## Store registration

In `src/redux/store.ts`:

```ts
import kalpauthReducer from './slices/kalpauth/kalpauthSlice';

export const store = configureStore({
  reducer: {
    kalpauth: kalpauthReducer,
    // ... other reducers
  },
});
```

## Data flow

1. User submits credentials → `dispatch(loginUser({ email, password }))`
2. On success, token is persisted to `localStorage` under `kalp_access_token`
3. `KalpSessionProvider` dispatches `checkSession()` on mount to restore session
4. UI reads `state.kalpauth.isAuthenticated` / `state.kalpauth.authUser` / `state.kalpauth.loading` via `useAppSelector`
5. On logout, `dispatch(logout())` clears token from localStorage and resets state

## Route usage

```tsx
// src/app/[locale]/kalpauth/page.tsx
'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser } from '@/redux/slices/kalpauth/kalpauthThunk';

export default function KalpAuthPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(s => s.kalpauth);
  // ... render login form, dispatch loginUser on submit
}
```
