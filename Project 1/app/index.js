import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect immediately to Onboarding Screen 1
  return <Redirect href="/onboarding" />;
}
