import {Display} from 'rot-js';
import Modal from './Modal';
jest.mock('rot-js');

describe('Modal', () => {
  let mockedDisplay: jest.MockedObjectDeep<Display>;

  beforeEach(() => {
    mockedDisplay = jest.mocked(new Display());
  });

  it('runs', () => {
    expect(new Modal(mockedDisplay, jest.fn(), 'hello', 10, 0, 0)).toBeDefined();
  });
});
