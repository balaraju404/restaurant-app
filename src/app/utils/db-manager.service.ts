import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
 providedIn: 'root',
})
export class DBManagerService {
 constructor() { }

 static async setData(data: any, key: string): Promise<void> {
  try {
   await Preferences.set({
    key,
    value: JSON.stringify(data),
   });
  } catch (error) {
   console.error('Error setting data:', error);
  }
 }

 static async getData<T>(key: string): Promise<T | null> {
  try {
   const { value } = await Preferences.get({ key });
   return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
   console.error('Error getting data:', error);
   return null;
  }
 }

 static async removeData(key: string): Promise<void> {
  try {
   await Preferences.remove({ key });
  } catch (error) {
   console.error('Error removing data:', error);
  }
 }

 static async clearAll(): Promise<void> {
  try {
   await Preferences.clear();
  } catch (error) {
   console.error('Error clearing data:', error);
  }
 }
}
