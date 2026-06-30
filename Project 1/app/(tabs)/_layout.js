import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabIcon({ name, focused, label }) {
  const color = focused ? '#2563EB' : '#9CA3AF';
  const weight = focused ? '700' : '500';

  return (
    <View style={styles.tabItem}>
      <Ionicons name={name} size={24} color={color} />
      <Text style={[styles.tabLabel, { color, fontWeight: weight }]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#111827',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: 0,
          paddingTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search-outline" focused={focused} label="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'bookmark' : 'bookmark-outline'}
              focused={focused}
              label="List"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-circle-outline" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    paddingTop: 12,
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
});
