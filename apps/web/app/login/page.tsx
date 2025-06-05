import LoginForm from "../../components/LoginForm";
import { Locale } from "../../config/locales";

type LoginPageProps = {
  params: Locale;
  searchParams: {
    error?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <LoginForm error={searchParams.error} />;
}
