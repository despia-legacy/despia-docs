---
title: Health
description: Read and write Apple Health and Android Health Connect data.
package: Core/HealthKit
section: packages
group: Health
icon: faceid
order: 138
---

# Health

Reads steps, heart rate, sleep and workouts, saves measurements, and can send new samples to your server in the background. The same type names work on iOS and Android, and the first read of a type asks the person for permission. Needs a health usage description for iOS; iPads and some Android phones have no health store.

**When to use it.** Add it when your app shows or records health and fitness data on the device, or forwards it to your backend. If you want data from wearable brands through a cloud service, look at the Terra package instead.

<PackageSample/>

## Replaces the HealthKit package

`health` replaces the HealthKit package: `dsx.module.healthkit` is now `dsx.module.health`. One package covers Apple Health on iOS and Health Connect on Android, with the same type names on both. Raw HealthKit identifiers (`HKQuantityTypeIdentifierStepCount` and so on) are still accepted as input.

```javascript
// the last 7 days of steps and heart rate, one total per day
const data = await dsx.module.health.read({ types: ["steps", "heartRate"], days: 7 })
// { steps: [{ type: "steps", unit: "count", start, end, value, source }, ...], heartRate: [...] }

// every stored sample since a moment
const raw = await dsx.module.health.read({ types: ["steps"], start: "2026-10-09T00:00:00Z", aggregate: "none" })
```

`read` takes `types`, a window (`start` and `end` as ISO 8601 times, or `days`, default 1) and `aggregate`: `none` (every stored sample), `day` (default) or `hour`. Each sample is `{ type, unit, start, end, value, source }`. Raw samples come from every recorder (phone and watch), so group by `source` before summing.

## Types

| Name | iOS (HealthKit) | Android (Health Connect) | Unit |
| :-- | :-- | :-- | :-- |
| `steps` | `HKQuantityTypeIdentifierStepCount` | `StepsRecord` | count |
| `heartRate` | `HKQuantityTypeIdentifierHeartRate` | `HeartRateRecord` | count/min |
| `restingHeartRate` | `HKQuantityTypeIdentifierRestingHeartRate` | `RestingHeartRateRecord` | count/min |
| `walkingHeartRate` | `HKQuantityTypeIdentifierWalkingHeartRateAverage` | `HeartRateRecord` | count/min |
| `heartRateVariability` | `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` | `HeartRateVariabilityRmssdRecord` | ms |
| `activeEnergy` | `HKQuantityTypeIdentifierActiveEnergyBurned` | `ActiveCaloriesBurnedRecord` | kcal |
| `basalEnergy` | `HKQuantityTypeIdentifierBasalEnergyBurned` | `BasalMetabolicRateRecord` | kcal |
| `distanceWalkingRunning` | `HKQuantityTypeIdentifierDistanceWalkingRunning` | `DistanceRecord` | m |
| `distanceCycling` | `HKQuantityTypeIdentifierDistanceCycling` | `DistanceRecord` | m |
| `distanceSwimming` | `HKQuantityTypeIdentifierDistanceSwimming` | `DistanceRecord` | m |
| `flightsClimbed` | `HKQuantityTypeIdentifierFlightsClimbed` | `FloorsClimbedRecord` | count |
| `exerciseMinutes` | `HKQuantityTypeIdentifierAppleExerciseTime` | `ExerciseSessionRecord` | min |
| `sleep` | `HKCategoryTypeIdentifierSleepAnalysis` | `SleepSessionRecord` | stage |
| `mindfulMinutes` | `HKCategoryTypeIdentifierMindfulSession` | none (reads `[]`) | min |
| `workouts` | `HKWorkoutTypeIdentifier` | `ExerciseSessionRecord` | workout |
| `weight` | `HKQuantityTypeIdentifierBodyMass` | `WeightRecord` | kg |
| `leanBodyMass` | `HKQuantityTypeIdentifierLeanBodyMass` | `LeanBodyMassRecord` | kg |
| `height` | `HKQuantityTypeIdentifierHeight` | `HeightRecord` | m |
| `bodyFat` | `HKQuantityTypeIdentifierBodyFatPercentage` | `BodyFatRecord` | % |
| `bodyTemperature` | `HKQuantityTypeIdentifierBodyTemperature` | `BodyTemperatureRecord` | degC |
| `bloodPressureSystolic` | `HKQuantityTypeIdentifierBloodPressureSystolic` | `BloodPressureRecord` | mmHg |
| `bloodPressureDiastolic` | `HKQuantityTypeIdentifierBloodPressureDiastolic` | `BloodPressureRecord` | mmHg |
| `bloodGlucose` | `HKQuantityTypeIdentifierBloodGlucose` | `BloodGlucoseRecord` | mg/dL |
| `oxygenSaturation` | `HKQuantityTypeIdentifierOxygenSaturation` | `OxygenSaturationRecord` | % |
| `respiratoryRate` | `HKQuantityTypeIdentifierRespiratoryRate` | `RespiratoryRateRecord` | count/min |
| `vo2Max` | `HKQuantityTypeIdentifierVO2Max` | `Vo2MaxRecord` | ml/(kg*min) |
| `water` | `HKQuantityTypeIdentifierDietaryWater` | `HydrationRecord` | L |
| `dietaryEnergy` | `HKQuantityTypeIdentifierDietaryEnergyConsumed` | `NutritionRecord` | kcal |
| `protein` | `HKQuantityTypeIdentifierDietaryProtein` | `NutritionRecord` | g |
| `carbohydrates` | `HKQuantityTypeIdentifierDietaryCarbohydrates` | `NutritionRecord` | g |
| `fat` | `HKQuantityTypeIdentifierDietaryFatTotal` | `NutritionRecord` | g |

## Background webhook

`observe({ types, frequency, server, userId })` sends new samples to your own HTTPS endpoint (`server`) in the background; `unobserve({ types })` (or `types: "all"`) stops it. The request body carries `v: 2`, `type: "health.samples"`, `platform`, `sentAt` and `samples[]`, where each sample has a stable `id` for de-duplication; the older keys `event`, `eventId`, `userId`, `timestamp` and `data` are kept beside them. Requests carry `Idempotency-Key`. On Android, background delivery runs about every 15 minutes at best.

## When health data is not available

On a device without a health store (an iPad without the Health app, an Android phone without Health Connect), data calls reject with `health_unavailable` and the package broadcasts `unavailable` with `{ error, code, message }`. `status()` resolves `{ available: false, reason: "health_unavailable" }` instead.

Despia V3 calls (`readhealthkit://`, `writehealthkit://`, `healthkit://...`) keep working through the Legacy polyfill.

For apps built on Despia V3, see [Migrate from Despia V3](/migrate/web-view-apps).

<PackageReference/>
