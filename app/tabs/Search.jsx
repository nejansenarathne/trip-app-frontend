import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import DestinationCard from "../../components/DestinationCard";
import FavoriteCard from "../../components/FavoriteCard";
import { useDestinationContext } from "../../contexts/DestinationContext";

const Search = () => {
  const { destinations, favorites } = useDestinationContext();

  const params = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDescList, setSearchDescList] = useState([]);

  const inputRef = useRef(null);

  // ✅ AUTO OPEN KEYBOARD WHEN TAB IS OPENED
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }, []),
  );

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchQuery(value);

    if (trimmedValue === "") {
      setSearchDescList([]);
      return;
    }

    setSearchDescList(
      destinations.filter((item) =>
        item.name.toLowerCase().includes(trimmedValue.toLowerCase()),
      ),
    );
  };

  const CardSpacer = () => <View style={{ width: 14 }} />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Become an Explorer</Text>
        <Text style={styles.subtitle}>
          Discover places that match your vibe
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          ref={inputRef}
          placeholder="Search destinations"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* SEARCH RESULTS */}
      {searchDescList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>

          <FlatList
            data={searchDescList}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={CardSpacer}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <DestinationCard destination={item} />}
          />
        </View>
      )}

      {/* RECENTLY VISITED */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently visited</Text>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>
            Your visited places will appear here
          </Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => <FavoriteCard destination={item} />}
          />
        )}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 22,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    padding: 0,
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  emptyText: {
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 6,
  },
});
