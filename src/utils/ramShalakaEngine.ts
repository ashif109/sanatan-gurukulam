import ramShalakaData from '../data/ramShalakaData.json';

export interface ChaupaiData {
  id: string;
  devanagari: string;
  transliteration: string;
  translation_en: string;
  translation_hi: string;
  guidance_summary: string;
  theme: string;
  blocks: string[];
}

export interface RamShalakaResult {
  selectedCellIndex: number;
  chaupai: ChaupaiData;
  extractedSequence: string[];
}

const CHAUPAIS = ramShalakaData as ChaupaiData[];

/**
 * Generates the authentic 15x15 (225 cells) Ram Shalaka Grid
 * by mathematically interleaving the 9 chaupais.
 */
export function generateGrid(): string[] {
  const grid: string[] = new Array(225);
  for (let i = 0; i < 225; i++) {
    const chaupaiIndex = i % 9;
    const blockIndex = Math.floor(i / 9);
    grid[i] = CHAUPAIS[chaupaiIndex].blocks[blockIndex];
  }
  return grid;
}

/**
 * Extracts the chaupai sequence starting from a specific grid cell,
 * simulating the traditional reading method of jumping every 9th square.
 */
export function resolveChaupai(selectedIndex: number): RamShalakaResult {
  if (selectedIndex < 0 || selectedIndex > 224) {
    throw new Error("Invalid grid index. Must be between 0 and 224.");
  }

  const grid = generateGrid();
  const extractedSequence: string[] = [];
  
  // Traditional extraction: take every 9th syllable
  for (let i = 0; i < 25; i++) {
    const idx = (selectedIndex + (i * 9)) % 225;
    extractedSequence.push(grid[idx]);
  }

  // The chaupai that this cell belongs to is mathematically determined by modulo 9
  const chaupaiIndex = selectedIndex % 9;

  return {
    selectedCellIndex: selectedIndex,
    chaupai: CHAUPAIS[chaupaiIndex],
    extractedSequence
  };
}

/**
 * Provides a cryptographically secure random selection from the 225 cells.
 * This ensures no algorithmic bias or predictability in "Let Ram guide me" mode.
 */
export function cryptoRandomSelect(): RamShalakaResult {
  // Use Web Crypto API for high-quality randomness
  const array = new Uint32Array(1);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else if (typeof process !== 'undefined' && require) {
    // Fallback for Node environment testing
    const crypto = require('crypto');
    array[0] = crypto.randomBytes(4).readUInt32LE(0);
  } else {
    // Ultimate fallback if no crypto is available (highly unlikely in modern environments)
    array[0] = Math.floor(Math.random() * 4294967296);
  }

  // modulo bias is negligible since 225 is very small compared to 2^32
  const selectedIndex = array[0] % 225;
  return resolveChaupai(selectedIndex);
}
