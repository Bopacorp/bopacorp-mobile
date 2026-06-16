import React, { useState } from 'react';
import { StyleSheet, FlatList, View as RNView, Pressable, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface CatalogItem {
  id: string;
  name: string;
  category: 'Celular' | 'Internet' | 'Telefonía';
  price: string;
  features: string[];
}

const MOCK_CATALOG: CatalogItem[] = [];

const CATEGORY_ICONS = {
  Celular: 'mobile',
  Internet: 'wifi',
  Telefonía: 'phone',
};

export default function CatalogScreen() {
  const colorScheme = useColorScheme();
  const currentColors = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Celular' | 'Internet' | 'Telefonía'>('Todos');

  const filteredCatalog = MOCK_CATALOG.filter(item => {
    return selectedCategory === 'Todos' || item.category === selectedCategory;
  });

  const renderItem = ({ item }: { item: CatalogItem }) => {
    const iconName = CATEGORY_ICONS[item.category] as React.ComponentProps<typeof FontAwesome>['name'];

    return (
      <View style={[styles.card, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: currentColors.secondary }]}>
              <FontAwesome name={iconName} size={20} color={currentColors.primary} />
            </View>
            <RNView>
              <Text style={[styles.itemName, { color: currentColors.text }]}>{item.name}</Text>
              <Text style={[styles.itemCategory, { color: currentColors.mutedForeground }]}>{item.category}</Text>
            </RNView>
          </View>
          <Text style={[styles.priceText, { color: currentColors.primary }]}>{item.price}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: currentColors.border }]} />

        <View style={styles.featuresContainer}>
          {item.features.map((feature, index) => (
            <View key={index} style={styles.featureLine}>
              <FontAwesome name="check-circle" size={14} color="#0ca678" style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={[styles.featureText, { color: currentColors.text }]}>{feature}</Text>
            </View>
          ))}
        </View>

        <Pressable 
          style={[styles.button, { backgroundColor: currentColors.primary }]}
          onPress={() => alert(`Plan "${item.name}" seleccionado.`)}
        >
          <Text style={styles.buttonText}>Ofrecer Plan</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {/* Category Tabs */}
      <View style={styles.categoriesWrapper}>
        {(['Todos', 'Celular', 'Internet', 'Telefonía'] as const).map((category) => {
          const isActive = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryTab,
                {
                  backgroundColor: isActive ? currentColors.primary : currentColors.card,
                  borderColor: currentColors.border,
                }
              ]}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  {
                    color: isActive ? '#ffffff' : currentColors.text,
                    fontWeight: isActive ? 'bold' : 'normal',
                  }
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredCatalog}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryTabText: {
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  featuresContainer: {
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  featureLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  button: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
