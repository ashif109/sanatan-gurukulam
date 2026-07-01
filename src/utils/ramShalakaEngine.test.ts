import { describe, it, expect } from 'vitest';
import { generateGrid, resolveChaupai, cryptoRandomSelect } from './ramShalakaEngine';

describe('Ram Shalaka Engine Verification', () => {
  it('should generate exactly 225 grid cells', () => {
    const grid = generateGrid();
    expect(grid.length).toBe(225);
    // Ensure no cell is undefined
    grid.forEach(cell => expect(cell).toBeDefined());
  });

  it('should extract the correct sequence mathematically for cell 0', () => {
    const result = resolveChaupai(0);
    // For cell 0, the chaupai must be index 0
    expect(result.chaupai.id).toBe('chaupai_1');
    expect(result.extractedSequence.length).toBe(25);
    
    // The extracted sequence from cell 0 should exactly match the blocks of chaupai_1
    expect(result.extractedSequence).toEqual(result.chaupai.blocks);
  });

  it('should extract the correct sequence for a mid-grid cell (e.g. 10)', () => {
    const result = resolveChaupai(10);
    expect(result.chaupai.id).toBe('chaupai_2');
    
    // When clicking index 10, it's the second block of chaupai 2.
    // The sequence starts from the clicked cell, so it should be cyclically shifted
    expect(result.extractedSequence[0]).toBe(result.chaupai.blocks[1]);
    expect(result.extractedSequence[24]).toBe(result.chaupai.blocks[0]);
  });

  it('should resolve every single cell to exactly one valid chaupai of 25 syllables', () => {
    for (let i = 0; i < 225; i++) {
      const result = resolveChaupai(i);
      expect(result.extractedSequence.length).toBe(25);
      expect(result.chaupai).toBeDefined();
      expect(result.chaupai.id).toMatch(/chaupai_[1-9]/);
    }
  });

  it('should produce a statistically fair random selection distribution (no bias)', () => {
    const trials = 10000;
    const selectionCounts: Record<string, number> = {
      'chaupai_1': 0, 'chaupai_2': 0, 'chaupai_3': 0, 
      'chaupai_4': 0, 'chaupai_5': 0, 'chaupai_6': 0,
      'chaupai_7': 0, 'chaupai_8': 0, 'chaupai_9': 0
    };

    for (let i = 0; i < trials; i++) {
      const result = cryptoRandomSelect();
      selectionCounts[result.chaupai.id]++;
    }

    // Expected value for uniform distribution is trials / 9
    const expectedCount = trials / 9;
    
    // We allow a 10% margin of error for randomness
    const margin = expectedCount * 0.10;

    Object.values(selectionCounts).forEach(count => {
      expect(count).toBeGreaterThan(expectedCount - margin);
      expect(count).toBeLessThan(expectedCount + margin);
    });
  });
});
