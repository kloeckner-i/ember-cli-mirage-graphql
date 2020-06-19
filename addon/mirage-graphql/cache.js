const cache = [];

export function getCache({ key, schema }) {
  return cache.find((entry) => key === entry.key && schema === entry.schema);
}

export function putCache(entry) {
  const existingEntry = getCache(entry);

  if (existingEntry) {
    existingEntry.value = entry.value;
  } else {
    cache.push(entry);
  }

  return entry;
}
