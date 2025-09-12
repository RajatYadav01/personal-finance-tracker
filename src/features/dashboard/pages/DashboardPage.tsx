import { useQuery } from "@tanstack/react-query";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import { Link, useLocation } from "react-router";
import {
  Home,
  Wallet,
  CreditCard,
  Settings,
  BarChart2,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useAuthContext } from "../../authentication";
import { BudgetPage, getBudgets } from "../../budget";
import { ReportPage } from "../../report";
import { SettingsPage } from "../../settings";
import { getCategories } from "../../category";
import { TransactionPage } from "../../transaction";
import SummaryCards from "../components/SummaryCards";
import SpendingChart from "../components/SpendingChart";
import RecentTransactions from "../components/RecentTransactions";
import BudgetProgress from "../components/BudgetProgress";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import {
  getSummary,
  getRecentTransactions,
  getSpendingTrends,
} from "../services/Dashboard";

export const DashboardPage = () => {
  const { loginStatusState, logOut } = useAuthContext();
  const isUserAuthenticated = !!loginStatusState.userID;
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const tabs = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Transactions", path: "/dashboard/transactions", icon: CreditCard },
    { name: "Budget", path: "/dashboard/budget", icon: Wallet },
    { name: "Reports", path: "/dashboard/reports", icon: BarChart2 },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const {
    data: recentTransactions = [],
    isLoading: recentTransactionsLoading,
    error: recentTransactionsError,
  } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: () => getRecentTransactions({ limit: 5 }),
    enabled: isUserAuthenticated,
  });

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary"],
    queryFn: () => getSummary(),
    enabled: isUserAuthenticated,
  });

  const {
    data: trends = [],
    isLoading: trendsLoading,
    error: trendsError,
  } = useQuery({
    queryKey: ["spending-trends"],
    queryFn: () => getSpendingTrends({ months: 6 }),
    enabled: isUserAuthenticated,
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(),
    enabled: isUserAuthenticated,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isUserAuthenticated,
  });

  return (
    <div className="flex flex-col min-h-full space-y-2 bg-gradient-to-br from-blue-50 to-white">
      <Header
        pageType="Dashboard"
        onMobileMenuClick={() => setIsMobileMenuOpen(true)}
      />
      {isMobileMenuOpen && (
        <Fragment>
          <div
            className="w-full min-h-full fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
  ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <button
              className="ml-[65%] px-8 py-6 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <div
              className="relative p-2 w-full h-20 flex flex-row items-center rounded-3xl text-[0.9rem] md:text-[1.5rem] lg:text-[1.75rem]"
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

            <TabGroup
              className="flex-[1_1_0]"
              selectedIndex={tabs.findIndex(
                (tab) => tab.path === location.pathname
              )}
              onChange={() => {}}
            >
              <TabList className="flex flex-col space-x-1 p-1 mb-6">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    as={Link}
                    to={tab.path}
                    className={({ selected }) =>
                      `flex flex-row justify-center items-center w-full rounded-full py-2 text-xl font-medium leading-5 ${
                        selected
                          ? "bg-white shadow text-blue-700"
                          : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-1">
                      <tab.icon size={20} />
                    </span>
                    <span className="ml-1">{tab.name}</span>
                  </Tab>
                ))}
              </TabList>
            </TabGroup>
          </div>
        </Fragment>
      )}
      <TabGroup
        className="flex-[1_1_0]"
        selectedIndex={tabs.findIndex((tab) => tab.path === location.pathname)}
        onChange={() => {}}
      >
        <TabList className="hidden md:flex flex-row space-x-1 rounded-full bg-gray-100 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              as={Link}
              to={tab.path}
              className={({ selected }) =>
                `flex flex-row justify-center items-center w-full rounded-full py-2 text-xl font-medium leading-5 ${
                  selected
                    ? "bg-white shadow text-blue-700"
                    : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                }`
              }
            >
              <span className="mr-1">
                <tab.icon size={20} />
              </span>
              <span className="ml-1">{tab.name}</span>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <h1 className="mt-2 mb-4 text-center text-2xl font-lato font-[500]">
              Your financial dashboard
            </h1>
            {summaryLoading || trendsLoading || recentTransactionsLoading ? (
              <LoadingSpinner />
            ) : (
              <Fragment>
                {(summaryError || trendsError || recentTransactionsError) && (
                  <ErrorMessage message="Failed to load dashboard data" />
                )}
                <SummaryCards
                  balance={summary?.balance || 0}
                  income={summary?.income || 0}
                  expenses={summary?.expenses || 0}
                  previousIncome={summary?.previous_month_income || 0}
                  previousExpenses={summary?.previous_month_expenses || 0}
                />

                <div className="mt-4 mb-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <SpendingChart data={trends} />
                    <RecentTransactions
                      transactions={recentTransactions}
                      categories={categories}
                    />
                  </div>

                  <div className="space-y-6">
                    <BudgetProgress budgets={budgets} />
                  </div>
                </div>
              </Fragment>
            )}
          </TabPanel>
          <TabPanel>
            <TransactionPage />
          </TabPanel>
          <TabPanel>
            <BudgetPage />
          </TabPanel>
          <TabPanel>
            <ReportPage />
          </TabPanel>
          <TabPanel>
            <SettingsPage />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Footer />
    </div>
  );
};
