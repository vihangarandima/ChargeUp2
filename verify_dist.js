const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  // Stabilized atan2 calculation
  const c = 2 * Math.atan2(Math.sqrt(Math.max(0, Math.min(1, a))), Math.sqrt(1 - Math.max(0, Math.min(1, a))));
  return R * c;
};

// Test cases
const tests = [
  { p1: [6.9271, 79.8612], p2: [6.8447, 79.9055], name: "Normal coordinates" },
  { p1: [0, 0], p2: [0, 0], name: "Same point" },
  { p1: [90, 0], p2: [-90, 0], name: "Antipodes" },
  { p1: [45, 45], p2: [45.00000001, 45.00000001], name: "Very close points" },
  { p1: [NaN, 0], p2: [0, 0], name: "NaN coordinate" },
];

tests.forEach(t => {
  const dist = calculateDistance(...t.p1, ...t.p2);
  console.log(`${t.name}: ${dist} (Type: ${typeof dist})`);
});
