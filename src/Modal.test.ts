import {Display} from 'rot-js';
import Modal from './Modal';
jest.mock('rot-js');

describe('Modal', () => {
  let mockedDisplay: jest.Mock<typeof Display>;

  beforeEach(() => {
    mockedDisplay = new Display() as unknown as jest.Mock<typeof Display>;
  });
  afterEach(() => {
    mockedDisplay.mockClear();
  });

  it('runs', () => {
    new Modal(mockedDisplay, undefined, 'hello', 10, 0, 0);
    expect(1).toBe(1);
  });
});
