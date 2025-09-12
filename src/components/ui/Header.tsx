import { Link } from "react-router";
import { Wallet, ChevronUp, ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useAuthContext } from "../../features/authentication";

interface HeaderProps {
  pageType?: string;
  onMobileMenuClick?: () => void;
}

export default function Header({ pageType, onMobileMenuClick }: HeaderProps) {
  const { loginStatusState, logOut, tokenRefresh } = useAuthContext();

  useEffect(() => {
    if (loginStatusState.loggedIn) {
      tokenRefresh();
    }
  }, [loginStatusState.loggedIn]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  let showLoginLink = false;
  let showRegisterLink = false;
  let showDashboardLink = false;
  let showUserMenu = false;

  if (pageType === "Home") {
    if (loginStatusState.userID) showDashboardLink = true;
    else {
      showRegisterLink = true;
      showLoginLink = true;
    }
  } else if (pageType === "Registration" || pageType === "Login") {
    showRegisterLink = false;
    showLoginLink = false;
    showDashboardLink = false;
  } else if (pageType === "Reset Password") {
    showRegisterLink = false;
    showLoginLink = true;
    showDashboardLink = false;
  } else if (pageType === "Dashboard") {
    if (loginStatusState.userID) showUserMenu = true;
    showLoginLink = false;
    showRegisterLink = false;
    showDashboardLink = false;
  }

  return (
    <nav className="w-full px-4 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <Wallet className="text-gray-400" size={32} />
        <span className="ml-2 font-manrope text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-[500] text-gray-400">
          Personal Finance Tracker
        </span>
      </Link>
      <div className="flex space-x-4">
        {showLoginLink && (
          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl hover:underline"
          >
            Log in
          </Link>
        )}
        {showRegisterLink && (
          <Link to="/register">
            <Button className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
              Get Started
            </Button>
          </Link>
        )}
        {showDashboardLink && (
          <Link to="/dashboard">
            <Button className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl">
              Go to Dashboard
            </Button>
          </Link>
        )}
        {onMobileMenuClick && (
          <button
            onClick={onMobileMenuClick}
            className="md:hidden p-2 rounded hover:bg-gray-200"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        )}
        {loginStatusState.loggedIn && showUserMenu && (
          <div
            className="max-md:hidden relative w-full h-10 flex flex-row items-center rounded-3xl text-[0.9rem] md:text-[1.5rem] lg:text-[1.75rem]"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <span className="inline-flex justify-center items-center w-[1.25rem] md:w-[1.75rem] h-[1.25rem] md:h-[1.75rem] rounded-[50%] bg-gray-500 text-gray-100 text-center text-[0.75em]">
              {loginStatusState.userName.substring(0, 1)}
            </span>
            <p className="pl-2 flex-[1_1_auto] text-gray-500 text-[0.75em]">
              {loginStatusState.userName}
            </p>
            <span>
              {isUserMenuOpen ? (
                <ChevronUp
                  className="pl-2 text-[0.75em]"
                  aria-label="User menu toggle"
                  size={32}
                />
              ) : (
                <ChevronDown
                  className="pl-2 text-[0.75em]"
                  aria-label="User menu toggle"
                  size={32}
                />
              )}
              {isUserMenuOpen && (
                <div className="absolute top-[2.5rem] left-[0%] w-[100%] bg-white rounded-lg shadow-lg">
                  <button
                    type="button"
                    onClick={logOut}
                    className="w-full py-2 px-2 hover:bg-gray-100 text-gray-600 text-[0.75em] text-left"
                  >
                    Log out
                  </button>
                </div>
              )}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
