import { Link } from "react-router";
import {
  type LucideProps,
  ArrowRight,
  BarChart2,
  PieChart,
  WalletCards,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { useAuthContext } from "../features/authentication";

export default function Home() {
  const { loginStatusState } = useAuthContext();

  const FeatureCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ComponentType<LucideProps>;
    title: string;
    description: string;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-blue-600" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const features = [
    {
      icon: BarChart2,
      title: "Real-time Analytics",
      description:
        "Track your spending patterns with beautiful, interactive charts and reports.",
    },
    {
      icon: PieChart,
      title: "Budget Tracking",
      description:
        "Set budgets and get alerts when you're approaching your limits.",
    },
    {
      icon: WalletCards,
      title: "All Accounts in One Place",
      description:
        "Connect all your financial accounts for a complete financial picture.",
    },
    {
      icon: Zap,
      title: "Quick Insights",
      description:
        "Get personalized insights to help you save more and spend smarter.",
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-blue-50 to-white">
      <Header pageType="Home" />
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Take control of your life by tracking your{" "}
          <span className="text-blue-600">finances</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          The all-in-one personal finance tracker that helps you manage your
          money and achieve your financial goals effortlessly.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to={!loginStatusState.userID ? "/login" : "/dashboard"}>
            <Button size="lg">
              {!loginStatusState.userID ? "Start tracking" : "Go to Dashboard"}
            </Button>
          </Link>
          <Link to="/features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your personal finances effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your finances?
          </h2>
          <Link to={!loginStatusState.userID ? "/register" : "/dashboard"}>
            <Button variant="primary" size="lg">
              {!loginStatusState.userID ? "Get Started" : "Go to Dashboard"}
              <ArrowRight className="inline-flex ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
