import '@testing-library/jest-dom';

// Polyfill Audio for tests
class MockAudio {
  constructor() {}
  play() { return Promise.resolve(); }
}

// @ts-ignore
global.Audio = MockAudio;

