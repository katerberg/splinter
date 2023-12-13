import {Display} from 'rot-js';
import Modal from './Modal';
jest.mock('rot-js');

describe('Modal', () => {
  let mockedDisplay: jest.MockedObjectDeep<Display>;

  beforeEach(() => {
    jest.spyOn(window, 'addEventListener').mockImplementation(() => {});
    mockedDisplay = jest.mocked(new Display());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('runs', () => {
    expect(new Modal(mockedDisplay, jest.fn(), 'hello', 10, 0, 0)).toBeDefined();
  });

  it('listens for input matching specified choices', () => {
    const createElementSpy = jest.spyOn(window, 'addEventListener');
    const modal = new Modal(mockedDisplay, jest.fn(), 'hello', 10, 0, 0);

    expect(createElementSpy).toHaveBeenCalledWith('keydown', modal);
    expect(1).toEqual(1);
  });

  it('does nothing is the key pressed is not in the given choices', () => {
    const mockCallback = jest.fn();
    new Modal(mockedDisplay, mockCallback, 'hello', 10, 0, 0, {82: 'hello'});
    const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockRemoveEventListener).not.toHaveBeenCalled();
  });

  it('clears the listener when the key is pressed and it matches one of the choices', () => {
    (window.addEventListener as unknown as jest.Mock).mockRestore();
    const mockCallback = jest.fn();
    const modal = new Modal(mockedDisplay, mockCallback, 'hello', 10, 0, 0, {82: 'hello'});
    const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

    window.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 82}));

    expect(mockCallback).toHaveBeenCalledWith('hello');
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', modal);
  });

  it('clears the listener when any key is pressed if no choices are given', () => {
    (window.addEventListener as unknown as jest.Mock).mockRestore();
    const mockCallback = jest.fn();
    const modal = new Modal(mockedDisplay, mockCallback, 'hello', 10, 0, 0);
    const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

    window.dispatchEvent(new KeyboardEvent('keydown', {keyCode: 90}));

    expect(mockCallback).toHaveBeenCalled();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', modal);
  });
});
