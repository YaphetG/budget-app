import { create } from 'zustand';

/**
 * Zustand store for managing authentication state.
 */
const useAuthStore = create((set) => ({
  // The Firebase user object if logged in, otherwise null.
  user: null,
  // The household ID associated with the logged-in user.
  householdId: null,
  // True while checking auth state on initial load or during login/signup.
  isLoading: true,
  // Holds any authentication error.
  error: null,

  /**
   * Action to set the user state. Typically called by the onAuthStateChanged listener.
   * @param {object | null} user - The Firebase user object or null.
   */
  setUser: (user) => set({ user, isLoading: false, error: null }),

  /**
   * Action to set the user's household ID.
   * @param {string} id - The household ID.
   */
  setHouseholdId: (id) => set({ householdId: id }),

  /**
   * Action to call when an authentication process (login/signup) starts.
   */
  authStart: () => set({ isLoading: true, error: null }),

  /**
   * Action to call when an authentication process succeeds.
   * @param {object} user - The Firebase user object.
   * @param {string} householdId - The user's household ID.
   */
  authSuccess: (user, householdId) => set({ user, householdId, isLoading: false, error: null }),

  /**
   * Action to call when an authentication process fails.
   * @param {Error} error - The error object from Firebase.
   */
  authFail: (error) => set({ error, isLoading: false }),

  /**
   * Action to clear user state on logout.
   */
  logOut: () => set({ user: null, householdId: null, isLoading: false, error: null }),
}));

export default useAuthStore;
