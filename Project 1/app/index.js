import { Redirect } from 'expo-router';

export default function Index() {
  // Directly to Home — login/register deferred until user action
  return <Redirect href="/(tabs)" />;
}
