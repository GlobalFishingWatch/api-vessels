const entrySymbol = Symbol("configEntry");

const isConfigValue = entry => entry[entrySymbol];

const getEntryValue = (environmentKey, defaults, environments) => {
  const environmentValue = process.env[environmentKey];

  if (environmentValue !== undefined) {
    return environmentValue;
  }

  const activeEnvironment = process.env.NODE_ENV || "development";

  const environmentSettings = environments[activeEnvironment] || {};

  const inheritanceChain = [
    activeEnvironment,
    ...(environmentSettings.inherits || [])
  ];

  for (let i = 0; i < inheritanceChain.length; i += 1) {
    const environment = inheritanceChain[i];
    const value = defaults[environment];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const sanitizeEnvironmentEntry = (environments, entry) => {
  if (isConfigValue(entry)) {
    const { key, doc, defaults = {}, required } = entry;

    const value = getEntryValue(key, defaults, environments);

    if (value === undefined && required) {
      return { value, errors: [`(${key}: ${doc})`] };
    }

    return { value, errors: [] };
  }

  return Object.entries(entry).reduce(
    (result, [key, subEntry]) => {
      const { value, errors } = sanitizeEnvironmentEntry(
        environments,
        subEntry
      );

      return {
        value: {
          ...result.value,
          [key]: value
        },
        errors: [...result.errors, ...errors]
      };
    },
    { value: {}, errors: [] }
  );
};

module.exports = {
  entry(settings) {
    return {
      [entrySymbol]: true,
      ...settings
    };
  },

  sanitizeEnvironment(environments, rootEntry) {
    const { value, errors } = sanitizeEnvironmentEntry(environments, rootEntry);

    if (errors && errors.length > 0) {
      throw new Error(
        `You need to configure the following environment variables: ${errors.join(
          ", "
        )}`
      );
    }

    return value;
  }
};
