import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Image } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

function HeaderLogo() {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{ width: 130, height: 32, resizeMode: 'contain' }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.tint,
        tabBarInactiveTintColor: currentColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: currentColors.card,
          borderTopColor: currentColors.border,
        },
        headerStyle: {
          backgroundColor: currentColors.card,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: currentColors.text,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <HeaderLogo />,
          tabBarLabel: 'Negociaciones',
          tabBarIcon: ({ color }) => <TabBarIcon name="handshake-o" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={22}
                    color={currentColors.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color }) => <TabBarIcon name="tags" color={color} />,
        }}
      />
      <Tabs.Screen
        name="employability"
        options={{
          title: 'Postulación',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-text-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
