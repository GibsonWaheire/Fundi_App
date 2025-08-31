// Fundi Unlock Service
// Handles tracking which fundis have been unlocked by which users

import { buildApiUrl } from '../config/api.js';

export const fundiUnlockService = {
  // Get all fundi unlocks
  async getAllUnlocks() {
    try {
      const response = await fetch(buildApiUrl('fundiUnlocks'));
      if (!response.ok) {
        throw new Error('Failed to fetch fundi unlocks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fundi unlocks:', error);
      return [];
    }
  },

  // Get unlock info for a specific fundi
  async getFundiUnlock(fundiId) {
    try {
      const response = await fetch(`${buildApiUrl('fundiUnlocks')}?fundi_id=${fundiId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fundi unlock');
      }
      const unlocks = await response.json();
      return unlocks[0] || null; // Return first match or null
    } catch (error) {
      console.error('Error fetching fundi unlock:', error);
      return null;
    }
  },

  // Check if a fundi is unlocked by a specific user
  async isFundiUnlockedByUser(fundiId, userId) {
    try {
      const unlock = await this.getFundiUnlock(fundiId);
      if (!unlock) return false;
      return unlock.unlocked_by.includes(userId);
    } catch (error) {
      console.error('Error checking fundi unlock status:', error);
      return false;
    }
  },

  // Unlock a fundi for a user
  async unlockFundi(fundiId, userId) {
    try {
      const existingUnlock = await this.getFundiUnlock(fundiId);
      
      if (existingUnlock) {
        // Fundi already has unlock record, update it
        if (!existingUnlock.unlocked_by.includes(userId)) {
          const updatedUnlock = {
            ...existingUnlock,
            unlocked_by: [...existingUnlock.unlocked_by, userId],
            unlock_count: existingUnlock.unlock_count + 1,
            last_unlocked_at: new Date().toISOString()
          };
          
          const response = await fetch(`${buildApiUrl('fundiUnlocks')}/${existingUnlock.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUnlock)
          });
          
          if (!response.ok) {
            throw new Error('Failed to update fundi unlock');
          }
          
          return await response.json();
        } else {
          // User already unlocked this fundi
          return existingUnlock;
        }
      } else {
        // Create new unlock record
        const newUnlock = {
          fundi_id: fundiId,
          unlocked_by: [userId],
          unlock_count: 1,
          first_unlocked_at: new Date().toISOString(),
          last_unlocked_at: new Date().toISOString()
        };
        
        const response = await fetch(buildApiUrl('fundiUnlocks'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUnlock)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create fundi unlock');
        }
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error unlocking fundi:', error);
      throw error;
    }
  },

  // Get all fundis unlocked by a specific user
  async getUnlockedFundisByUser(userId) {
    try {
      const allUnlocks = await this.getAllUnlocks();
      const userUnlocks = allUnlocks.filter(unlock => 
        unlock.unlocked_by.includes(userId)
      );
      return userUnlocks;
    } catch (error) {
      console.error('Error fetching user unlocks:', error);
      return [];
    }
  },

  // Get fundis that are already unlocked (by anyone)
  async getAlreadyUnlockedFundis() {
    try {
      const allUnlocks = await this.getAllUnlocks();
      return allUnlocks.filter(unlock => unlock.unlock_count > 0);
    } catch (error) {
      console.error('Error fetching already unlocked fundis:', error);
      return [];
    }
  },

  // Get unlock count for a fundi
  async getUnlockCount(fundiId) {
    try {
      const unlock = await this.getFundiUnlock(fundiId);
      return unlock ? unlock.unlock_count : 0;
    } catch (error) {
      console.error('Error getting unlock count:', error);
      return 0;
    }
  }
};

export default fundiUnlockService;
