import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  createContext,
  type ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { login, refreshToken, logout } from "../services/User";

interface LoginStatusDetails {
  loggedIn: boolean;
  userID: string;
  userName: string;
  userDefaultCurrency: string;
}

export const LoginStatusAction = {
  SET_LOGGED_IN_STATUS: "SET_LOGGED_IN_STATUS",
  SET_USER_ID: "SET_USER_ID",
  SET_USER_NAME: "SET_USER_NAME",
  SET_USER_DEFAULT_CURRENCY: "SET_USER_DEFAULT_CURRENCY",
} as const;

export type LoginStatusAction = typeof LoginStatusAction[keyof typeof LoginStatusAction];


interface SetLoggedInStatus {
  type: typeof LoginStatusAction.SET_LOGGED_IN_STATUS;
  payload: boolean;
}

interface SetLoginUserID {
  type: typeof LoginStatusAction.SET_USER_ID;
  payload: string;
}

interface SetLoginUserName {
  type: typeof LoginStatusAction.SET_USER_NAME;
  payload: string;
}

interface SetLoginUserDefaultCurrency {
  type: typeof LoginStatusAction.SET_USER_DEFAULT_CURRENCY;
  payload: string;
}

type LoginStatusActions =
  | SetLoggedInStatus
  | SetLoginUserID
  | SetLoginUserName
  | SetLoginUserDefaultCurrency;

const loginStatusInitialState: LoginStatusDetails = {
  loggedIn: false,
  userID: "",
  userName: "",
  userDefaultCurrency: "",
};

function loginStatusReducer(
  state: LoginStatusDetails,
  action: LoginStatusActions
) {
  switch (action.type) {
    case LoginStatusAction.SET_LOGGED_IN_STATUS:
      return { ...state, loggedIn: action.payload };
    case LoginStatusAction.SET_USER_ID:
      return { ...state, userID: action.payload };
    case LoginStatusAction.SET_USER_NAME:
      return { ...state, userName: action.payload };
    case LoginStatusAction.SET_USER_DEFAULT_CURRENCY:
      return { ...state, userDefaultCurrency: action.payload };
    default:
      return state;
  }
}

export interface AuthContextType {
  loginStatusState: LoginStatusDetails;
  dispatchLoginStatusState: React.Dispatch<LoginStatusActions>;
  logIn: (logInFormData: string) => Promise<string>;
  tokenRefresh: () => Promise<void>;
  logOut: () => Promise<string>;
  startLogOutTimer: (callback: () => Promise<void>) => void;
  clearLogOutTimer: () => void;
  isLogOutTimerActive: React.RefObject<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<string | null>(
    localStorage.getItem("isLoggedIn") || null
  );
  const [loginStatusState, dispatchLoginStatusState] = useReducer(
    loginStatusReducer,
    loginStatusInitialState
  );

  useEffect(() => {
    if (isUserLoggedIn !== null) {
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_LOGGED_IN_STATUS,
        payload: true,
      });
    } else {
      setIsUserLoggedIn(localStorage.getItem("isLoggedIn"));
    }
  }, [isUserLoggedIn]);

  const logOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLogOutTimerActive = useRef<boolean>(false);
  const startLogOutTimer = async (callback: () => Promise<void>) => {
    if (!logOutTimerRef.current) {
      isLogOutTimerActive.current = true;
      logOutTimerRef.current = setTimeout(async () => {
        logOutTimerRef.current = null;
        await callback();
      }, 900000);
    }
  };
  const clearLogOutTimer = () => {
    if (logOutTimerRef.current) {
      clearTimeout(logOutTimerRef.current);
      logOutTimerRef.current = null;
      isLogOutTimerActive.current = false;
    }
  };

  const navigate = useNavigate();

  const logIn = async (logInFormData: string): Promise<string> => {
    const loginResponse = await login(logInFormData);
    if (loginResponse.access_token && loginResponse.refresh_token) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginResponse.access_token;
      localStorage.setItem("refreshToken", loginResponse.refresh_token);
      localStorage.setItem("isLoggedIn", "true");
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_LOGGED_IN_STATUS,
        payload: true,
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_ID,
        payload: loginResponse.user.id,
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_NAME,
        payload: loginResponse.user.name,
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_DEFAULT_CURRENCY,
        payload: loginResponse.user.currency,
      });
    }
    return loginResponse.message;
  };

  const tokenRefresh = async (): Promise<void> => {
    try {
      const refreshTokenResponse = await refreshToken();
      if (refreshTokenResponse.access_token) {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + refreshTokenResponse.access_token;
        localStorage.setItem("isLoggedIn", "true");
        dispatchLoginStatusState({
          type: LoginStatusAction.SET_LOGGED_IN_STATUS,
          payload: true,
        });
        dispatchLoginStatusState({
          type: LoginStatusAction.SET_USER_ID,
          payload: refreshTokenResponse.user.id,
        });
        dispatchLoginStatusState({
          type: LoginStatusAction.SET_USER_NAME,
          payload: refreshTokenResponse.user.name,
        });
        dispatchLoginStatusState({
          type: LoginStatusAction.SET_USER_DEFAULT_CURRENCY,
          payload: refreshTokenResponse.user.currency,
        });
        startLogOutTimer(tokenRefresh);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        if (
          isLogOutTimerActive.current ||
          localStorage.getItem("isLoggedIn") ||
          localStorage.getItem("refreshToken")
        ) {
          clearLogOutTimer();
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("refreshToken");
          dispatchLoginStatusState({
            type: LoginStatusAction.SET_LOGGED_IN_STATUS,
            payload: false,
          });
          dispatchLoginStatusState({
            type: LoginStatusAction.SET_USER_ID,
            payload: "",
          });
          dispatchLoginStatusState({
            type: LoginStatusAction.SET_USER_NAME,
            payload: "",
          });
          dispatchLoginStatusState({
            type: LoginStatusAction.SET_USER_DEFAULT_CURRENCY,
            payload: "",
          });
          toast.info("You have been logged out due to expired token");
          navigate("/login", { replace: true });
        }
      }
    }
  };

  const logOut = async (): Promise<string> => {
    const logoutResponse = await logout();
    if (logoutResponse === "Logged out successfully") {
      if (isLogOutTimerActive) {
        clearLogOutTimer();
      }
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("refreshToken");
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_LOGGED_IN_STATUS,
        payload: false,
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_ID,
        payload: "",
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_NAME,
        payload: "",
      });
      dispatchLoginStatusState({
        type: LoginStatusAction.SET_USER_DEFAULT_CURRENCY,
        payload: "",
      });
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
    return logoutResponse;
  };

  return (
    <AuthContext.Provider
      value={{
        loginStatusState,
        dispatchLoginStatusState,
        logIn,
        tokenRefresh,
        logOut,
        startLogOutTimer,
        clearLogOutTimer,
        isLogOutTimerActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
