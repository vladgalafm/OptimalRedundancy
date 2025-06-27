# OptimalRedundancy API Documentation

This document provides comprehensive API documentation for the OptimalRedundancy application - a mathematical optimization tool for solving optimal redundancy problems in Renewal Theory systems with multiple limitations.

## Table of Contents

- [Core Optimization APIs](#core-optimization-apis)
  - [DynamicProgrammingOptimizer](#dynamicprogrammingoptimizer)
  - [SystemSimulator](#systemsimulator)
  - [RedundancyCalculator](#redundancycalculator)
- [Mathematical Model APIs](#mathematical-model-apis)
  - [RenewalTheoryModel](#renewaltheorymodel)
  - [ReliabilityCalculator](#reliabilitycalculator)
  - [FailureIntensityProcessor](#failureintensityprocessor)
- [System Configuration APIs](#system-configuration-apis)
  - [SubsystemManager](#subsystemmanager)
  - [ConstraintValidator](#constraintvalidator)
  - [ParameterProcessor](#parameterprocessor)
- [Web Interface APIs](#web-interface-apis)
  - [FormHandler](#formhandler)
  - [ResultsRenderer](#resultsrenderer)
  - [ValidationManager](#validationmanager)
- [Internationalization APIs](#internationalization-apis)
  - [LanguageManager](#languagemanager)
  - [LocalizationUtils](#localizationutils)
- [Utility APIs](#utility-apis)
  - [MathUtils](#mathutils)
  - [DataFormatter](#dataformatter)
  - [ErrorHandler](#errorhandler)

---

## Core Optimization APIs

### DynamicProgrammingOptimizer

Main optimization engine that implements dynamic programming algorithms to find optimal redundancy solutions.

**Location:** `src/optimizer/DynamicProgrammingOptimizer.js`

#### Methods

##### `findOptimalSolution(systemConfig, constraints)`

Finds the optimal redundancy distribution for the given system configuration.

**Parameters:**
- `systemConfig` (Object): System configuration object
- `constraints` (Array): Array of constraint objects

**Returns:** `Promise<OptimalSolution>`

```javascript
const solution = await optimizer.findOptimalSolution({
  subsystems: [
    { id: 1, failureRate: 0.1, cost: 100 },
    { id: 2, failureRate: 0.2, cost: 150 }
  ],
  timeHorizon: 1000,
  simulationIterations: 10000
}, [
  { type: 'budget', value: 1000 },
  { type: 'weight', value: 500 }
]);
```

##### `calculateReliability(redundancyVector, systemConfig)`

Calculates system reliability for given redundancy distribution.

**Parameters:**
- `redundancyVector` (Array): Array of redundancy values [m1, m2, ..., mn]
- `systemConfig` (Object): System configuration object

**Returns:** `number` - System reliability value

---

### SystemSimulator

Implements imitation modeling algorithms for system behavior simulation.

**Location:** `src/simulator/SystemSimulator.js`

#### Methods

##### `runSimulation(config)`

Runs Monte Carlo simulation for system behavior analysis.

**Parameters:**
- `config` (Object): Simulation configuration

```javascript
const config = {
  subsystems: subsystemsArray,
  redundancyVector: [2, 3, 1, 4],
  timeHorizon: 1000,
  iterations: 10000,
  recoveryEnabled: true,
  recoveryRate: 0.5
};

const results = await simulator.runSimulation(config);
```

**Returns:** `Promise<SimulationResults>`

##### `getSystemState(time, redundancyVector)`

Gets system state at specific time point.

**Parameters:**
- `time` (number): Time point for state query
- `redundancyVector` (Array): Current redundancy distribution

**Returns:** `SystemState`

---

### RedundancyCalculator

Handles redundancy calculations and optimization constraints.

**Location:** `src/calculator/RedundancyCalculator.js`

#### Methods

##### `validateRedundancyVector(vector, constraints)`

Validates if redundancy vector satisfies all constraints.

**Parameters:**
- `vector` (Array): Redundancy vector to validate
- `constraints` (Array): Array of constraint objects

**Returns:** `ValidationResult`

##### `generateFeasibleSolutions(constraints, subsystemCount)`

Generates all feasible redundancy solutions within constraints.

**Parameters:**
- `constraints` (Array): System constraints
- `subsystemCount` (number): Number of subsystems

**Returns:** `Array<RedundancyVector>`

---

## Mathematical Model APIs

### RenewalTheoryModel

Implements Renewal Theory mathematical models for system analysis.

**Location:** `src/models/RenewalTheoryModel.js`

#### Methods

##### `calculateRenewalFunction(lambda, time)`

Calculates renewal function value for given failure rate and time.

**Parameters:**
- `lambda` (number): Failure intensity coefficient (λ > 0)
- `time` (number): Time point for calculation

**Returns:** `number` - Renewal function value

##### `getExpectedNumberOfRenewals(lambda, timeHorizon)`

Calculates expected number of renewals in given time horizon.

**Parameters:**
- `lambda` (number): Failure intensity coefficient
- `timeHorizon` (number): Time horizon for analysis

**Returns:** `number` - Expected number of renewals

---

### ReliabilityCalculator

Handles reliability calculations for individual subsystems and complete system.

**Location:** `src/models/ReliabilityCalculator.js`

#### Methods

##### `calculateSubsystemReliability(lambda, reserveElements, time)`

Calculates reliability of individual subsystem with reserve elements.

**Parameters:**
- `lambda` (number): Subsystem failure intensity
- `reserveElements` (number): Number of reserve elements (m ≥ 0)
- `time` (number): Time point for calculation

**Returns:** `number` - Subsystem reliability

##### `calculateSystemReliability(subsystems, time)`

Calculates overall system reliability for sequential connection.

**Parameters:**
- `subsystems` (Array): Array of subsystem objects
- `time` (number): Time point for calculation

**Returns:** `number` - System reliability

---

### FailureIntensityProcessor

Processes and validates failure intensity coefficients.

**Location:** `src/models/FailureIntensityProcessor.js`

#### Methods

##### `validateFailureIntensity(lambda)`

Validates failure intensity coefficient value.

**Parameters:**
- `lambda` (number): Failure intensity to validate

**Returns:** `ValidationResult`

##### `processFailureIntensityArray(lambdaArray)`

Processes and validates array of failure intensity coefficients.

**Parameters:**
- `lambdaArray` (Array): Array of λ values

**Returns:** `ProcessedFailureIntensities`

---

## System Configuration APIs

### SubsystemManager

Manages subsystem configuration and parameters.

**Location:** `src/config/SubsystemManager.js`

#### Methods

##### `createSubsystem(config)`

Creates new subsystem configuration object.

**Parameters:**
- `config` (Object): Subsystem configuration

```javascript
const subsystem = manager.createSubsystem({
  id: 1,
  failureRate: 0.1,
  maxReserveElements: 10,
  cost: 100,
  weight: 50
});
```

**Returns:** `Subsystem`

##### `validateSubsystemConfig(config)`

Validates subsystem configuration parameters.

**Parameters:**
- `config` (Object): Subsystem configuration to validate

**Returns:** `ValidationResult`

---

### ConstraintValidator

Handles validation of system constraints and limitations.

**Location:** `src/config/ConstraintValidator.js`

#### Methods

##### `addConstraint(type, value, coefficients)`

Adds new constraint to the system.

**Parameters:**
- `type` (string): Constraint type ('budget', 'weight', 'volume', 'custom')
- `value` (number): Constraint limit value
- `coefficients` (Array): Constraint coefficients for each subsystem

**Returns:** `Constraint`

##### `validateConstraints(redundancyVector, constraints)`

Validates if redundancy vector satisfies all constraints.

**Parameters:**
- `redundancyVector` (Array): Redundancy distribution to validate
- `constraints` (Array): Array of constraint objects

**Returns:** `ValidationResult`

---

### ParameterProcessor

Processes and validates input parameters.

**Location:** `src/config/ParameterProcessor.js`

#### Methods

##### `processSystemParameters(inputData)`

Processes raw input data into system parameters.

**Parameters:**
- `inputData` (Object): Raw input data from web form

**Returns:** `ProcessedParameters`

##### `validateParameterRanges(parameters)`

Validates parameter values are within acceptable ranges.

**Parameters:**
- `parameters` (Object): System parameters to validate

**Returns:** `ValidationResult`

---

## Web Interface APIs

### FormHandler

Handles web form interactions and user input processing.

**Location:** `src/web/FormHandler.js`

#### Methods

##### `handleFormSubmit(formData)`

Processes form submission and initiates optimization.

**Parameters:**
- `formData` (FormData): Form data from web interface

**Returns:** `Promise<OptimizationResult>`

##### `validateFormInput(formData)`

Validates form input data before processing.

**Parameters:**
- `formData` (FormData): Form data to validate

**Returns:** `ValidationResult`

---

### ResultsRenderer

Handles rendering of optimization results in web interface.

**Location:** `src/web/ResultsRenderer.js`

#### Methods

##### `renderOptimalSolution(solution, containerId)`

Renders optimal solution in specified container.

**Parameters:**
- `solution` (OptimalSolution): Optimization solution to render
- `containerId` (string): DOM container ID for rendering

**Returns:** `void`

##### `renderSystemReliability(reliability, timeHorizon, containerId)`

Renders system reliability information.

**Parameters:**
- `reliability` (number): System reliability value
- `timeHorizon` (number): Time horizon for analysis
- `containerId` (string): DOM container ID

**Returns:** `void`

---

### ValidationManager

Manages real-time validation of user inputs.

**Location:** `src/web/ValidationManager.js`

#### Methods

##### `validateRealTime(inputElement, validationRules)`

Provides real-time validation for input elements.

**Parameters:**
- `inputElement` (HTMLElement): Input element to validate
- `validationRules` (Object): Validation rules configuration

**Returns:** `void`

##### `showValidationErrors(errors, containerId)`

Displays validation errors in specified container.

**Parameters:**
- `errors` (Array): Array of validation error objects
- `containerId` (string): DOM container ID for error display

**Returns:** `void`

---

## Internationalization APIs

### LanguageManager

Manages language switching and localization.

**Location:** `src/i18n/LanguageManager.js`

#### Methods

##### `setLanguage(languageCode)`

Sets current application language.

**Parameters:**
- `languageCode` (string): Language code ('en', 'uk')

**Returns:** `Promise<void>`

##### `getCurrentLanguage()`

Gets current application language.

**Returns:** `string` - Current language code

##### `getAvailableLanguages()`

Gets list of available languages.

**Returns:** `Array<LanguageInfo>`

---

### LocalizationUtils

Utility functions for text localization.

**Location:** `src/i18n/LocalizationUtils.js`

#### Methods

##### `translate(key, parameters)`

Translates text key to current language.

**Parameters:**
- `key` (string): Translation key
- `parameters` (Object): Optional parameters for interpolation

**Returns:** `string` - Translated text

##### `formatNumber(number, locale)`

Formats number according to locale settings.

**Parameters:**
- `number` (number): Number to format
- `locale` (string): Locale code

**Returns:** `string` - Formatted number

---

## Utility APIs

### MathUtils

Mathematical utility functions.

**Location:** `src/utils/MathUtils.js`

#### Methods

##### `factorial(n)`

Calculates factorial of given number.

**Parameters:**
- `n` (number): Non-negative integer

**Returns:** `number` - Factorial value

##### `combination(n, k)`

Calculates binomial coefficient C(n,k).

**Parameters:**
- `n` (number): Total number of items
- `k` (number): Number of items to choose

**Returns:** `number` - Binomial coefficient

##### `exponentialDistribution(lambda, x)`

Calculates exponential distribution probability density.

**Parameters:**
- `lambda` (number): Rate parameter
- `x` (number): Value point

**Returns:** `number` - Probability density

---

### DataFormatter

Formats data for display and export.

**Location:** `src/utils/DataFormatter.js`

#### Methods

##### `formatOptimalSolution(solution)`

Formats optimal solution for display.

**Parameters:**
- `solution` (OptimalSolution): Solution object to format

**Returns:** `FormattedSolution`

##### `exportToCSV(data, filename)`

Exports data to CSV format.

**Parameters:**
- `data` (Array): Data to export
- `filename` (string): Output filename

**Returns:** `void`

---

### ErrorHandler

Handles error management and logging.

**Location:** `src/utils/ErrorHandler.js`

#### Methods

##### `handleOptimizationError(error, context)`

Handles optimization-related errors.

**Parameters:**
- `error` (Error): Error object
- `context` (Object): Error context information

**Returns:** `void`

##### `logError(error, severity)`

Logs error with specified severity level.

**Parameters:**
- `error` (Error): Error to log
- `severity` (string): Error severity ('low', 'medium', 'high', 'critical')

**Returns:** `void`

---

## Data Structures

### OptimalSolution

```javascript
{
  redundancyVector: [2, 3, 1, 4],        // Optimal redundancy distribution
  systemReliability: 0.9847,              // Achieved system reliability
  totalCost: 850,                         // Total system cost
  constraintsSatisfied: true,              // Whether all constraints satisfied
  computationTime: 1250,                  // Computation time in ms
  iterationsPerformed: 15000,              // Simulation iterations performed
  convergenceReached: true                 // Whether algorithm converged
}
```

### SystemConfiguration

```javascript
{
  subsystems: [
    {
      id: 1,
      failureRate: 0.1,           // λ coefficient
      cost: 100,                  // Cost per reserve element
      weight: 50,                 // Weight per reserve element
      maxReserveElements: 10      // Maximum allowed reserve elements
    }
  ],
  timeHorizon: 1000,              // Analysis time horizon
  recoveryEnabled: false,          // Whether recovery is enabled  
  recoveryRate: 0.0,              // μ coefficient (if recovery enabled)
  simulationIterations: 10000      // Number of simulation iterations
}
```

### Constraint

```javascript
{
  type: 'budget',                 // Constraint type
  value: 1000,                   // Constraint limit
  coefficients: [100, 150, 200], // Coefficients for each subsystem
  satisfied: true                 // Whether constraint is satisfied
}
```

### SimulationResults

```javascript
{
  systemReliability: 0.9847,      // Calculated system reliability
  subsystemReliabilities: [0.98, 0.95, 0.99], // Individual reliabilities
  expectedFailures: 2.3,          // Expected number of failures
  meanTimeToFailure: 456.7,       // Mean time to first failure
  confidenceInterval: [0.980, 0.989], // 95% confidence interval
  simulationTime: 2340            // Simulation execution time in ms
}
```

### ValidationResult

```javascript
{
  isValid: true,                  // Whether validation passed
  errors: [],                     // Array of error messages
  warnings: [],                   // Array of warning messages
  validatedData: {}               // Processed/validated data
}
```

---

## Usage Examples

### Basic Optimization

```javascript
// Configure system with 3 subsystems
const systemConfig = {
  subsystems: [
    { id: 1, failureRate: 0.1, cost: 100, weight: 50 },
    { id: 2, failureRate: 0.2, cost: 150, weight: 75 },
    { id: 3, failureRate: 0.15, cost: 120, weight: 60 }
  ],
  timeHorizon: 1000,
  simulationIterations: 10000
};

// Define constraints
const constraints = [
  { type: 'budget', value: 1000, coefficients: [100, 150, 120] },
  { type: 'weight', value: 500, coefficients: [50, 75, 60] }
];

// Find optimal solution
const optimizer = new DynamicProgrammingOptimizer();
const solution = await optimizer.findOptimalSolution(systemConfig, constraints);

console.log('Optimal redundancy:', solution.redundancyVector);
console.log('System reliability:', solution.systemReliability);
```

### Web Interface Integration

```javascript
// Handle form submission
const formHandler = new FormHandler();
const resultsRenderer = new ResultsRenderer();

document.getElementById('optimizationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const result = await formHandler.handleFormSubmit(new FormData(e.target));
    resultsRenderer.renderOptimalSolution(result, 'resultsContainer');
  } catch (error) {
    ErrorHandler.handleOptimizationError(error, { formData: e.target });
  }
});
```

### Multi-language Support

```javascript
// Set language
const langManager = new LanguageManager();
await langManager.setLanguage('uk');

// Translate text
const localUtils = new LocalizationUtils();
const translatedText = localUtils.translate('optimization.results.title');
```

---

## Error Codes

| Code | Description | Severity |
|------|-------------|----------|
| `OPT_001` | Invalid failure intensity coefficient | High |
| `OPT_002` | Constraint violation detected | Medium |
| `OPT_003` | Maximum iterations exceeded | Medium |
| `OPT_004` | Numerical instability detected | High |
| `OPT_005` | Invalid subsystem configuration | High |
| `SIM_001` | Simulation convergence failed | Medium |
| `SIM_002` | Insufficient simulation iterations | Low |
| `VAL_001` | Parameter out of valid range | High |
| `VAL_002` | Missing required parameter | Critical |
| `WEB_001` | Form validation failed | Medium |

---

## Performance Considerations

- **Optimization Complexity**: O(n × C₁ × C₂ × ... × Cₖ) where n is subsystem count and Cᵢ are constraint limits
- **Memory Usage**: Proportional to state space size in dynamic programming
- **Simulation Accuracy**: Increases with iteration count but affects performance
- **Recommended Limits**: 
  - Subsystems: 1-15
  - Constraint coefficients: 1-1000
  - Simulation iterations: 1000-50000

---

## Configuration

### Webpack Configuration

The project uses Webpack for bundling. Key configuration in `webpack.config.js`:

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
```

### Environment Variables

- `OPTIMIZATION_MAX_ITERATIONS`: Maximum optimization iterations (default: 100000)
- `SIMULATION_DEFAULT_ITERATIONS`: Default simulation iterations (default: 10000)
- `DEBUG_MODE`: Enable debug logging (default: false)

---

## API Changelog

### Version 1.0.0
- Initial API implementation
- Basic optimization algorithms
- Web interface integration
- Internationalization support (English, Ukrainian)

---

## Notes

- All failure intensity coefficients (λ) must be positive values
- Recovery intensity (μ) is optional and must be positive if enabled
- System uses sequential connection - failure of any subsystem causes system failure
- Optimization uses dynamic programming with imitation modeling for verification
- Web interface provides real-time validation and responsive design
- Results include confidence intervals for reliability estimates

---

*This documentation corresponds to OptimalRedundancy v1.0.0*
*For updates and issues, visit: https://github.com/vladgalafm/OptimalRedundancy* 