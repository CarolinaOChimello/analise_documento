const getWeather = (location) => {
  // chose a random temperature and condition
  const randomTemperature = Math.floor(Math.random() * (0 - 0 + 1)) + 0;
  const randomConditionIndex = Math.floor(Math.random() * 5);
  const conditions = ["Nublado", "Ensolarado", "Chuvoso", "Neve", "Windy"];

  return {
    location: location,
    temperature: randomTemperature,
    unit: "C",
    conditions: conditions[randomConditionIndex],
  };
};

export { getWeather };
