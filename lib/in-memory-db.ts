// Base de datos central en memoria para toda la aplicación
// Esto asegura consistencia entre todos los pasos del workflow

export interface InMemoryDatabase {
  owners: any[];
  customerFilters: any[];
  competitions: any[];
  assets: any[];
  socialStrategies: any[];
  predictions: any[];
  roiCalculations: any[];
  mapData: any[];
  trackEvents: any[];
  leads: any[];
}

// Base de datos central compartida
const inMemoryDB: InMemoryDatabase = {
  owners: [],
  customerFilters: [],
  competitions: [],
  assets: [],
  socialStrategies: [],
  predictions: [],
  roiCalculations: [],
  mapData: [],
  trackEvents: [],
  leads: [],
};

// Funciones para acceder a la base de datos
export function getInMemoryDB(): InMemoryDatabase {
  return inMemoryDB;
}

// Funciones de ayuda para cada tipo de dato
export function getOwners() { return inMemoryDB.owners; }
export function getCustomerFilters() { return inMemoryDB.customerFilters; }
export function getCompetitions() { return inMemoryDB.competitions; }
export function getAssets() { return inMemoryDB.assets; }
export function getSocialStrategies() { return inMemoryDB.socialStrategies; }
export function getPredictions() { return inMemoryDB.predictions; }
export function getRoiCalculations() { return inMemoryDB.roiCalculations; }
export function getMapData() { return inMemoryDB.mapData; }
export function getTrackEvents() { return inMemoryDB.trackEvents; }
export function getLeads() { return inMemoryDB.leads; }

// Funciones de upsert genéricas
export function upsertOwner(ownerData: any) {
  const existing = inMemoryDB.owners.findIndex(o => o.id === ownerData.id);
  if (existing >= 0) {
    inMemoryDB.owners[existing] = { ...ownerData, updatedAt: new Date() };
  } else {
    inMemoryDB.owners.push({ ...ownerData, createdAt: new Date(), updatedAt: new Date() });
  }
}

export function upsertCustomerFilter(filterData: any) {
  const existing = inMemoryDB.customerFilters.findIndex(f => f.ownerId === filterData.ownerId);
  if (existing >= 0) {
    inMemoryDB.customerFilters[existing] = { ...filterData, updatedAt: new Date() };
  } else {
    inMemoryDB.customerFilters.push({ ...filterData, createdAt: new Date(), updatedAt: new Date() });
  }
}

export function upsertSocialStrategy(strategyData: any) {
  const existing = inMemoryDB.socialStrategies.findIndex(s => s.ownerId === strategyData.ownerId);
  if (existing >= 0) {
    inMemoryDB.socialStrategies[existing] = { ...strategyData, updatedAt: new Date() };
  } else {
    inMemoryDB.socialStrategies.push({ ...strategyData, createdAt: new Date(), updatedAt: new Date() });
  }
}

export function upsertPrediction(predictionData: any) {
  const existing = inMemoryDB.predictions.findIndex(p => p.ownerId === predictionData.ownerId);
  if (existing >= 0) {
    inMemoryDB.predictions[existing] = { ...predictionData, updatedAt: new Date() };
  } else {
    inMemoryDB.predictions.push({ ...predictionData, createdAt: new Date(), updatedAt: new Date() });
  }
}

export function addCompetition(competitionData: any) {
  inMemoryDB.competitions.push({ ...competitionData, createdAt: new Date(), updatedAt: new Date() });
}

export function addAsset(assetData: any) {
  inMemoryDB.assets.push({ ...assetData, createdAt: new Date(), updatedAt: new Date() });
}

export function addRoiCalculation(roiData: any) {
  inMemoryDB.roiCalculations.push({ ...roiData, createdAt: new Date(), updatedAt: new Date() });
}

export function upsertMapData(mapDataEntry: any) {
  const existing = inMemoryDB.mapData.findIndex(m => m.ownerId === mapDataEntry.ownerId);
  if (existing >= 0) {
    inMemoryDB.mapData[existing] = { ...mapDataEntry, updatedAt: new Date() };
  } else {
    inMemoryDB.mapData.push({ ...mapDataEntry, createdAt: new Date(), updatedAt: new Date() });
  }
}

export function addTrackEvent(eventData: any) {
  inMemoryDB.trackEvents.push({ ...eventData, timestamp: new Date() });
}