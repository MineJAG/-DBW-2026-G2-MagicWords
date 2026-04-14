import { UserProvider } from "./userContext.jsx";

export default function ContextProvider({ children }) {
  return (

      <UserProvider>{children}</UserProvider>

  );
}

