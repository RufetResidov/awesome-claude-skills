import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Border } from '../../constants/Theme';

const TOPICS = [
  { id: '1', name: 'Texnologiya' },
  { id: '2', name: 'İdman' },
  { id: '3', name: 'Biznes' },
  { id: '4', name: 'Siyasət' },
  { id: '5', name: 'Mədəniyyət' },
  { id: '6', name: 'Elm' },
  { id: '7', name: 'Səhiyyə' },
  { id: '8', name: 'Səyahət' },
];

export default function TopicPicker() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'light'];
  const router = useRouter();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleFinish = () => {
    // Navigate to tabs main layout
    router.push('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
          Maraqlarınızı Seçin
        </Text>
        <Text style={[styles.subtitle, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
          Sizə ən uyğun xəbərləri seçmək üçün mövzuları qeyd edin
        </Text>
      </View>

      <FlatList
        data={TOPICS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.topicCard,
                {
                  borderColor: isSelected ? activeColors.accent : activeColors.border,
                  backgroundColor: isSelected ? activeColors.accent + '20' : activeColors.surface,
                },
              ]}
              onPress={() => toggleSelect(item.id)}
            >
              <Text
                style={[
                  styles.topicText,
                  {
                    color: isSelected ? activeColors.accent : activeColors.text,
                    fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Medium',
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selected.length > 0 ? activeColors.primary : activeColors.border,
            },
          ]}
          disabled={selected.length === 0}
          onPress={handleFinish}
        >
          <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
            Tamamla
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.space_24,
  },
  header: {
    marginTop: Spacing.space_32,
    marginBottom: Spacing.space_32,
  },
  title: {
    fontSize: 26,
    marginBottom: Spacing.space_8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  list: {
    justifyContent: 'space-between',
  },
  topicCard: {
    flex: 1,
    height: 60,
    margin: Spacing.space_8,
    borderWidth: 1,
    borderRadius: Border.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 16,
  },
  footer: {
    marginVertical: Spacing.space_24,
  },
  button: {
    height: 56,
    borderRadius: Border.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});
