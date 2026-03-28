exports.resolveLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body || {};

    const lat = Number(latitude);
    const lng = Number(longitude);
    const acc = accuracy !== undefined ? Number(accuracy) : null;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ msg: "Valid latitude and longitude are required" });
    }

    const location = {
      latitude: lat,
      longitude: lng,
      accuracy: Number.isFinite(acc) ? acc : null,
      label: `Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`,
      source: "citizen-device",
      capturedAt: new Date().toISOString(),
      mapUrl: `https://maps.google.com/?q=${lat},${lng}`
    };

    res.json({
      success: true,
      msg: "Location captured successfully",
      location
    });
  } catch (err) {
    console.error("Resolve location error:", err);
    res.status(500).json({ msg: "Failed to resolve location", error: err.message });
  }
};
