import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useThemeColor } from './Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  actionLabel?: string;
  onAction?: () => void;
}) {
  const primaryColor = useThemeColor({}, 'primary');
  const mutedForeground = useThemeColor({}, 'mutedForeground');
  const cardBg = useThemeColor({}, 'card');
  const borderCol = useThemeColor({}, 'border');

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: borderCol }]}>
      <FontAwesome name={icon} size={48} color={mutedForeground} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.description, { color: mutedForeground }]}>{description}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={onAction}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
