import { Tabs } from "expo-router";
import React, { useRef, useEffect } from "react";
import { Image, View, StyleSheet, Pressable, PanResponder, Animated } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebarContext } from "../../context/SidebarContext";

const DRAWER_WIDTH = 260;

function HeaderLogo() {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: 130, height: 32, resizeMode: "contain" }}
    />
  );
}

export default function TabLayout() {
  return (
    <SidebarProvider>
      <TabLayoutContent />
    </SidebarProvider>
  );
}

function TabLayoutContent() {
  const { isOpen, setIsOpen } = useSidebarContext();
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? "light"];

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const isSwipeLeft = gestureState.dx < -10;
        const isSwipeRight = gestureState.dx > 10;

        if (!isOpen) {
          return evt.nativeEvent.pageX < 45 && isSwipeRight;
        }
        return isSwipeLeft;
      },
      onPanResponderGrant: () => {
        slideAnim.stopAnimation();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isOpen) {
          const newValue = Math.min(0, -DRAWER_WIDTH + gestureState.dx);
          slideAnim.setValue(newValue);
        } else {
          const newValue = Math.min(0, gestureState.dx);
          slideAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!isOpen) {
          if (gestureState.dx > DRAWER_WIDTH / 3 || gestureState.vx > 0.5) {
            setIsOpen(true);
          } else {
            Animated.timing(slideAnim, {
              toValue: -DRAWER_WIDTH,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        } else {
          if (gestureState.dx < -DRAWER_WIDTH / 3 || gestureState.vx < -0.5) {
            setIsOpen(false);
          } else {
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;

  const contentOpacity = slideAnim.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[styles.container, { backgroundColor: currentColors.background }]}
      {...panResponder.panHandlers}
    >
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: currentColors.primary,
            tabBarInactiveTintColor: currentColors.tabIconDefault,
            tabBarStyle: {
              display: "none",
            },
            headerStyle: {
              backgroundColor: currentColors.card,
              shadowColor: "transparent",
              elevation: 0,
            },
            headerTintColor: currentColors.text,
            headerShown: useClientOnlyValue(false, true),
            headerLeft: () => (
              <Pressable
                onPress={() => setIsOpen(true)}
                style={({ pressed }) => [
                  { marginLeft: 16, padding: 8 },
                  pressed && { opacity: 0.6 }
                ]}
              >
                <FontAwesome name="bars" size={20} color={currentColors.text} />
              </Pressable>
            ),
          }}
        >
          {}
          <Tabs.Screen
            name="clients"
            options={{
              title: "Clientes",
            }}
          />

          {}
          <Tabs.Screen
            name="negotiations"
            options={{
              title: "Negociaciones",
            }}
          />

          {}
          <Tabs.Screen
            name="documentation"
            options={{
              title: "Documentación",
            }}
          />

          {}
          <Tabs.Screen
            name="settings"
            options={{
              href: null,
              title: "Configuración",
            }}
          />
        </Tabs>
      </Animated.View>
      <Sidebar slideAnim={slideAnim} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
  },
  content: {
    flex: 1,
  },
});
