
import { OfflineItem } from "../types";

const STORAGE_KEY = "biblia_atos_offline_content";

export const saveOfflineItem = (item: OfflineItem): boolean => {
  try {
    const existing = getOfflineItems();
    // Evita duplicatas pelo ID (referência ou título)
    const filtered = existing.filter(i => i.id !== item.id);
    const updated = [item, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Erro ao salvar offline (provavelmente localStorage cheio):", error);
    return false;
  }
};

export const getOfflineItems = (): OfflineItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const deleteOfflineItem = (id: string): void => {
  const existing = getOfflineItems();
  const updated = existing.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const isItemSaved = (id: string): boolean => {
  const existing = getOfflineItems();
  return existing.some(i => i.id === id);
};

export const clearAllOffline = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
