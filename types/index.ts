export interface PersonRecord {
  id: number;
  name: string;
  dial: string;
  dial2?: string;
  dial3?: string;
  dial4?: string;
  address?: string;
  nationalId?: string;
  dateOfBirth?: string;
  occupation?: string;
  notes?: string;
  tableName: string;
}

export interface CarRecord {
  id: number;
  plate: string;
  model: string;
  color?: string;
  year?: string;
  ownerName?: string;
  ownerPhone?: string;
  imageUrl?: string;
  notes?: string;
  violations?: string;
}

export interface SearchResult<T> {
  results: T[];
  searchTime: number;
  totalScanned: number;
}

export interface AuthUser {
  username: string;
  fullName: string;
  role: string;
}

export type SearchCriteria = 'name' | 'phone' | 'plate' | 'model';
