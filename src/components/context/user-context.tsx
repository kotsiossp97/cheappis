import { type RouterOutputs } from "@/trpc/react";
import { createContext, useContext, useState } from "react";

type User = NonNullable<RouterOutputs["auth"]["me"]>;

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  user: User;
}

export const UserContextProvider: React.FC<UserProviderProps> = ({
  children,
  user,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  return (
    <UserContext.Provider
      value={{ user: currentUser, setUser: setCurrentUser }}
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
