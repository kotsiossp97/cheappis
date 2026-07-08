"use client";

import { type AppRouter } from "@/server/api/root";
import { authClient } from "@/server/better-auth/client";
import { api, type RouterOutputs } from "@/trpc/react";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type BetterFetchError } from "better-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type User = NonNullable<RouterOutputs["auth"]["me"]>;
type AuthMeError = TRPCClientErrorLike<AppRouter>;

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isPending: boolean;
  error: BetterFetchError | AuthMeError | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  user: User | null;
}

export const UserContextProvider: React.FC<UserProviderProps> = ({
  children,
  user,
}) => {
  const [overriddenUser, setOverriddenUser] = useState<{
    sessionUserId: string | null;
    user: User | null;
  } | null>(null);
  const { data: sessionData, isPending, error } = authClient.useSession();
  const sessionUserId = sessionData?.session?.userId ?? null;
  const hasSession = Boolean(sessionData?.session);
  const hasActiveOverride = overriddenUser?.sessionUserId === sessionUserId;

  const {
    data: userData,
    isLoading,
    error: userError,
  } = api.auth.me.useQuery(undefined, {
    retry: false,
    enabled: hasSession && !user && !hasActiveOverride,
  });

  const currentUser = useMemo<User | null>(() => {
    if (hasActiveOverride && overriddenUser) {
      return overriddenUser.user;
    }

    if (!hasSession || error || userError) {
      return null;
    }

    return user ?? userData ?? null;
  }, [
    hasActiveOverride,
    overriddenUser,
    hasSession,
    error,
    userError,
    user,
    userData,
  ]);

  const setUser = useCallback(
    (nextUser: User | null) => {
      setOverriddenUser({
        sessionUserId,
        user: nextUser,
      });
    },
    [sessionUserId],
  );

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        setUser,
        isPending:
          isPending || (hasSession && !user && !hasActiveOverride && isLoading),
        error: error || userError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
