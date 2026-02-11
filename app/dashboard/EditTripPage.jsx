import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useDestinationContext } from "../../contexts/DestinationContext";
import { useTripContext } from "../../contexts/TripContext";

/* ---------------- helpers ---------------- */
const getDaysBetween = (startISO, endISO) => {
  const out = [];
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    out.push(`${yyyy}-${mm}-${dd}`);
  }
  return out;
};

const prettyRange = (startISO, endISO) => {
  if (!startISO || !endISO) return "Pick your dates";

  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");

  const startText = s.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const endText = e.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return `${startText} – ${endText}`;
};

const EditTripPage = () => {
  const { tripId } = useLocalSearchParams();
  const { getTripById, updateTrip } = useTripContext();
  const { destinations, favorites } = useDestinationContext();
  const { createTrip } = useTripContext();

  const trip = getTripById(String(tripId));

  // local editable state
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  // ✅ prefill when trip loads
  useEffect(() => {
    if (!trip) return;
    setName(trip.name || "");
    setStartDate(trip.startDate || null);
    setEndDate(trip.endDate || null);
    setDays(trip.days || []);
  }, [trip]);

  /* ---------------- calendar range selection ---------------- */
  const onPickDate = (day) => {
    const picked = day.dateString;

    // Start fresh
    if (!startDate || (startDate && endDate)) {
      setStartDate(picked);
      setEndDate(null);
      setDays([]);
      setActiveDayIndex(null);
      setSearchQuery("");
      return;
    }

    // Finish range
    if (picked < startDate) {
      setEndDate(startDate);
      setStartDate(picked);
      return;
    }

    setEndDate(picked);
  };

  const dayDates = useMemo(() => {
    if (!startDate || !endDate) return [];
    return getDaysBetween(startDate, endDate);
  }, [startDate, endDate]);

  // ✅ rebuild days when range changes (keeps what it can)
  useEffect(() => {
    if (dayDates.length === 0) return;

    setDays((prev) => {
      const oldStopsByDay = new Map(
        prev.map((d) => [d.dayIndex, d.stops || []]),
      );

      return dayDates.map((dateISO, idx) => ({
        dayIndex: idx + 1,
        date: dateISO,
        stops: oldStopsByDay.get(idx + 1) || [],
      }));
    });
  }, [dayDates]);

  const markedDates = () => {
    const marks = {};
    if (startDate) {
      marks[startDate] = {
        startingDay: true,
        color: "#0F766E",
        textColor: "#fff",
      };
    }

    if (startDate && endDate) {
      const list = getDaysBetween(startDate, endDate);
      list.forEach((d) => (marks[d] = { color: "#0F766E", textColor: "#fff" }));
      marks[startDate] = {
        startingDay: true,
        color: "#0F766E",
        textColor: "#fff",
      };
      marks[endDate] = { endingDay: true, color: "#0F766E", textColor: "#fff" };
    }
    return marks;
  };

  /* ---------------- places logic ---------------- */
  const activeDay = days.find((d) => d.dayIndex === activeDayIndex);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return destinations.filter((d) => d.name.toLowerCase().includes(q));
  }, [searchQuery, destinations]);

  const isAlreadyAdded = (placeId) => {
    if (!activeDay) return false;
    return (activeDay.stops || []).some((s) => s.placeId === placeId);
  };

  const addPlaceToActiveDay = (placeId) => {
    if (!activeDay) return;

    setDays((prev) =>
      prev.map((d) => {
        if (d.dayIndex !== activeDayIndex) return d;
        if ((d.stops || []).some((s) => s.placeId === placeId)) return d;

        const newStop = {
          id: `stop_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          placeId,
        };

        return { ...d, stops: [...(d.stops || []), newStop] };
      }),
    );
  };

  const removeStopFromActiveDay = (stopId) => {
    if (!activeDay) return;

    setDays((prev) =>
      prev.map((d) => {
        if (d.dayIndex !== activeDayIndex) return d;
        return { ...d, stops: (d.stops || []).filter((s) => s.id !== stopId) };
      }),
    );
  };

  const canSave = name.trim() && startDate && endDate;

  const handleSave = async () => {
    if (!trip) return;
    if (!canSave) return;

    setError("");

    const res = await updateTrip(trip.id, {
      name: name.trim(),
      startDate,
      endDate,
      days,
    });

    if (!res.ok) {
      setError(res.message);
      return;
    }

    router.back();
  };

  if (!trip) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontWeight: "900", fontSize: 16 }}>Trip not found</Text>
        <Pressable style={{ marginTop: 12 }} onPress={() => router.back()}>
          <Text style={{ color: "#0F766E", fontWeight: "900" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  /* ---------------- UI cards ---------------- */
  const PlacePickCard = ({ place, disabled = false, onAdd }) => {
    return (
      <Pressable
        onPress={onAdd}
        disabled={disabled}
        style={[styles.pickCard, disabled && { opacity: 0.65 }]}
      >
        <Image source={{ uri: place.imageUrl }} style={styles.pickImage} />

        <View style={styles.pickContent}>
          <View style={styles.pickTopRow}>
            <Text numberOfLines={1} style={styles.pickTitle}>
              {place.name}
            </Text>

            <View style={styles.ratePill}>
              <Ionicons name="star" size={12} color="#0F766E" />
              <Text style={styles.rateText}>
                {typeof place.rating === "number"
                  ? place.rating.toFixed(1)
                  : place.rating}
              </Text>
            </View>
          </View>

          <Text numberOfLines={2} style={styles.pickDesc}>
            {place.shortDescription}
          </Text>

          <View style={styles.pickBottomRow}>
            <View style={styles.catPill}>
              <Text style={styles.catText}>{place.category}</Text>
            </View>

            {disabled ? (
              <View style={styles.addedPill}>
                <Ionicons name="checkmark" size={14} color="#0F766E" />
                <Text style={styles.addedPillText}>Added</Text>
              </View>
            ) : (
              <View style={styles.addBtn}>
                <Ionicons name="add" size={18} color="#fff" />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Edit trip</Text>
            <Text style={styles.subtitle}>Update your plan</Text>
          </View>
        </View>

        {/* Trip name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="pencil-outline" size={18} color="#64748B" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Eg: Ella weekend"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Dates</Text>

            <View style={styles.rangePill}>
              <Ionicons name="calendar-outline" size={16} color="#0F766E" />
              <Text style={styles.rangeText}>
                {prettyRange(startDate, endDate)}
              </Text>
            </View>
          </View>

          <Text style={styles.helperText}>
            Tap a start date, then an end date
          </Text>

          <View style={styles.calendarCard}>
            <Calendar
              onDayPress={onPickDate}
              markingType="period"
              markedDates={markedDates()}
              theme={{
                todayTextColor: "#0F766E",
                arrowColor: "#0F766E",
                monthTextColor: "#0F172A",
                textSectionTitleColor: "#64748B",
                dayTextColor: "#0F172A",
                textDisabledColor: "#CBD5E1",
              }}
            />
          </View>
        </View>

        {/* Itinerary */}
        {dayDates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary</Text>

            <View style={{ gap: 10, marginTop: 10 }}>
              {days.map((d) => {
                const isActive = activeDayIndex === d.dayIndex;
                const prettyDay = new Date(
                  d.date + "T00:00:00",
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <View key={d.date} style={styles.dayCard}>
                    <Pressable
                      style={styles.dayTop}
                      onPress={() => {
                        setActiveDayIndex(isActive ? null : d.dayIndex);
                        setSearchQuery("");
                      }}
                    >
                      <View>
                        <Text style={styles.dayTitle}>Day {d.dayIndex}</Text>
                        <Text style={styles.daySubtitle}>{prettyDay}</Text>
                      </View>

                      <View style={styles.dayRight}>
                        <View style={styles.countPill}>
                          <Text style={styles.countText}>
                            {(d.stops || []).length} places
                          </Text>
                        </View>

                        <Ionicons
                          name={isActive ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#64748B"
                        />
                      </View>
                    </Pressable>

                    {isActive && (
                      <View style={styles.dayBody}>
                        {/* Search */}
                        <View style={styles.searchWrap}>
                          <Ionicons
                            name="search-outline"
                            size={18}
                            color="#64748B"
                          />
                          <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search destinations to add"
                            placeholderTextColor="#94A3B8"
                            style={styles.searchInput}
                          />
                        </View>

                        {/* Results under search */}
                        {searchQuery.trim() !== "" && (
                          <>
                            <Text
                              style={[styles.smallTitle, { marginTop: 14 }]}
                            >
                              Results
                            </Text>

                            {filteredResults.length === 0 ? (
                              <Text style={styles.mutedText}>No matches</Text>
                            ) : (
                              <View style={{ gap: 10, marginTop: 10 }}>
                                {filteredResults.slice(0, 12).map((r) => (
                                  <PlacePickCard
                                    key={r.id}
                                    place={r}
                                    disabled={isAlreadyAdded(r.id)}
                                    onAdd={() => addPlaceToActiveDay(r.id)}
                                  />
                                ))}
                              </View>
                            )}
                          </>
                        )}

                        {/* Favorites collapsed by default */}
                        <Pressable
                          style={styles.collapseHeader}
                          onPress={() => setShowFavorites((v) => !v)}
                        >
                          <Text style={styles.smallTitle}>Your favorites</Text>
                          <Ionicons
                            name={showFavorites ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#64748B"
                          />
                        </Pressable>

                        {showFavorites && (
                          <>
                            {favorites.length === 0 ? (
                              <Text style={styles.mutedText}>
                                No favorites yet
                              </Text>
                            ) : (
                              <View style={{ gap: 10, marginTop: 10 }}>
                                {favorites.map((f) => (
                                  <PlacePickCard
                                    key={f.id}
                                    place={f}
                                    disabled={isAlreadyAdded(f.id)}
                                    onAdd={() => addPlaceToActiveDay(f.id)}
                                  />
                                ))}
                              </View>
                            )}
                          </>
                        )}

                        {/* Added places */}
                        <Text style={[styles.smallTitle, { marginTop: 18 }]}>
                          Added places
                        </Text>

                        {(activeDay?.stops || []).length === 0 ? (
                          <Text style={styles.mutedText}>
                            Nothing added yet
                          </Text>
                        ) : (
                          <View style={{ gap: 10, marginTop: 10 }}>
                            {activeDay.stops.map((s) => {
                              const place = destinations.find(
                                (x) => x.id === s.placeId,
                              );
                              if (!place) return null;

                              return (
                                <View key={s.id} style={styles.addedCard}>
                                  <Image
                                    source={{ uri: place.imageUrl }}
                                    style={styles.addedImage}
                                  />

                                  <View style={{ flex: 1 }}>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.addedTitle}
                                    >
                                      {place.name}
                                    </Text>
                                    <Text
                                      numberOfLines={1}
                                      style={styles.addedSub}
                                    >
                                      {place.shortDescription}
                                    </Text>
                                  </View>

                                  <Pressable
                                    onPress={() =>
                                      removeStopFromActiveDay(s.id)
                                    }
                                    hitSlop={10}
                                  >
                                    <Ionicons
                                      name="close-circle"
                                      size={24}
                                      color="#94A3B8"
                                    />
                                  </Pressable>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.saveBtn, { opacity: canSave ? 1 : 0.45 }]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Save changes</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EditTripPage;

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    height: 42,
    width: 42,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  title: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 2, fontSize: 13, fontWeight: "600", color: "#64748B" },

  section: { paddingHorizontal: 16, marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },

  inputWrap: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    padding: 0,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  rangePill: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#ECFDF5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  rangeText: {
    flexShrink: 1,
    color: "#0F766E",
    fontWeight: "900",
    fontSize: 12.5,
  },

  helperText: {
    marginTop: 8,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
  },

  calendarCard: {
    marginTop: 12,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  dayTop: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dayTitle: { fontSize: 15, fontWeight: "900", color: "#0F172A" },
  daySubtitle: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
  },

  dayRight: { flexDirection: "row", alignItems: "center", gap: 10 },

  countPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  countText: { fontSize: 12, fontWeight: "800", color: "#0F172A" },

  dayBody: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 14,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    padding: 0,
  },

  collapseHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  smallTitle: { fontSize: 13, fontWeight: "900", color: "#0F172A" },
  mutedText: { marginTop: 8, color: "#94A3B8", fontWeight: "700" },

  pickCard: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },

  pickImage: {
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },

  pickContent: { flex: 1, justifyContent: "space-between" },

  pickTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  pickTitle: { flex: 1, fontSize: 15, fontWeight: "900", color: "#0F172A" },

  pickDesc: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
    lineHeight: 18,
  },

  pickBottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ratePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rateText: { color: "#0F766E", fontWeight: "900", fontSize: 12 },

  catPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  catText: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "capitalize",
  },

  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
  },

  addedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  addedPillText: { color: "#0F766E", fontWeight: "900", fontSize: 12 },

  addedCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 10,
    marginTop: 10,
  },
  addedImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  addedTitle: { fontSize: 14.5, fontWeight: "900", color: "#0F172A" },
  addedSub: {
    marginTop: 3,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748B",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  saveBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#0F766E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 15 },
});
