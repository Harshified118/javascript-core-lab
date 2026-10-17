/**
 * 03_unit_converter.js
 * Category: Basic
 *
 * Description:
 * A modular conversion engine supporting Temperature (Celsius, Fahrenheit, Kelvin),
 * Length (meters, kilometers, miles, feet, inches), and Weight (kg, grams, lbs, ounces).
 */

const UnitConverter = {
  // Temperature Conversions
  temperature: {
    celsiusToFahrenheit(c) {
      return (c * 9) / 5 + 32;
    },
    fahrenheitToCelsius(f) {
      return ((f - 32) * 5) / 9;
    },
    celsiusToKelvin(c) {
      return c + 273.15;
    },
    kelvinToCelsius(k) {
      return k - 273.15;
    },
    convert(value, from, to) {
      const f = from.toLowerCase();
      const t = to.toLowerCase();
      if (f === t) return value;

      let celsius;
      if (f === "c" || f === "celsius") celsius = value;
      else if (f === "f" || f === "fahrenheit") celsius = this.fahrenheitToCelsius(value);
      else if (f === "k" || f === "kelvin") celsius = this.kelvinToCelsius(value);
      else throw new Error(`Unsupported temperature unit: ${from}`);

      if (t === "c" || t === "celsius") return celsius;
      if (t === "f" || t === "fahrenheit") return this.celsiusToFahrenheit(celsius);
      if (t === "k" || t === "kelvin") return this.celsiusToKelvin(celsius);
      throw new Error(`Unsupported temperature unit: ${to}`);
    },
  },

  // Length Conversions (Base unit: Meter)
  length: {
    ratiosToMeter: {
      m: 1.0,
      meter: 1.0,
      meters: 1.0,
      km: 1000.0,
      kilometer: 1000.0,
      cm: 0.01,
      mm: 0.001,
      mile: 1609.344,
      miles: 1609.344,
      foot: 0.3048,
      feet: 0.3048,
      inch: 0.0254,
      inches: 0.0254,
    },
    convert(value, from, to) {
      const f = from.toLowerCase();
      const t = to.toLowerCase();
      const fromRatio = this.ratiosToMeter[f];
      const toRatio = this.ratiosToMeter[t];
      if (!fromRatio) throw new Error(`Unknown length unit: ${from}`);
      if (!toRatio) throw new Error(`Unknown length unit: ${to}`);
      const meters = value * fromRatio;
      return meters / toRatio;
    },
  },

  // Weight Conversions (Base unit: Gram)
  weight: {
    ratiosToGram: {
      g: 1.0,
      gram: 1.0,
      kg: 1000.0,
      kilogram: 1000.0,
      lb: 453.59237,
      lbs: 453.59237,
      pound: 453.59237,
      oz: 28.349523,
      ounce: 28.349523,
    },
    convert(value, from, to) {
      const f = from.toLowerCase();
      const t = to.toLowerCase();
      const fromRatio = this.ratiosToGram[f];
      const toRatio = this.ratiosToGram[t];
      if (!fromRatio) throw new Error(`Unknown weight unit: ${from}`);
      if (!toRatio) throw new Error(`Unknown weight unit: ${to}`);
      const grams = value * fromRatio;
      return grams / toRatio;
    },
  },
};

function runDemo() {
  console.log("=== 03: Unit Converter Demo ===");

  // Temperature
  const boilingF = UnitConverter.temperature.convert(100, "c", "f");
  console.log(`100°C -> ${boilingF.toFixed(2)}°F`);
  const bodyC = UnitConverter.temperature.convert(98.6, "f", "c");
  console.log(`98.6°F -> ${bodyC.toFixed(2)}°C`);
  const roomK = UnitConverter.temperature.convert(25, "c", "k");
  console.log(`25°C -> ${roomK.toFixed(2)}K`);

  // Length
  const marathonKm = 42.195;
  const marathonMiles = UnitConverter.length.convert(marathonKm, "km", "miles");
  console.log(`Marathon ${marathonKm} km -> ${marathonMiles.toFixed(3)} miles`);
  const heightCm = 180;
  const heightFeet = UnitConverter.length.convert(heightCm, "cm", "feet");
  console.log(`${heightCm} cm -> ${heightFeet.toFixed(2)} feet`);

  // Weight
  const weightKg = 75;
  const weightLbs = UnitConverter.weight.convert(weightKg, "kg", "lbs");
  console.log(`${weightKg} kg -> ${weightLbs.toFixed(2)} lbs`);
}

if (require.main === module) {
  runDemo();
}

module.exports = UnitConverter;
