import { useQuery } from "@tanstack/react-query";
import { createActorWithConfig } from "../config";
import { getSessionParameter, storeSessionParameter, clearSessionParameter } from "../utils/urlParams";

const ADMIN_TOKEN_KEY = "adminActorToken";

export function storeAdminToken(token: string) {
  storeSessionParameter(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  clearSessionParameter(ADMIN_TOKEN_KEY);
}

export function getAdminToken(): string | null {
  return getSessionParameter(ADMIN_TOKEN_KEY);
}

/**
 * A dedicated actor hook for admin operations.
 * Initializes the actor when the user is marked as admin in localStorage.
 * Uses the canister's built-in principal-based access control.
 */
export function useAdminActor() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const { data: actor, isFetching } = useQuery({
    queryKey: ["adminActor", isAdmin],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Not authenticated as admin");
      }
      const actor = await createActorWithConfig();
      // Initialize with empty secret — the canister uses principal-based access control
      await actor._initializeAccessControlWithSecret("");
      return actor;
    },
    enabled: isAdmin,
    staleTime: Infinity,
  });

  return { actor: actor ?? null, isFetching };
}
