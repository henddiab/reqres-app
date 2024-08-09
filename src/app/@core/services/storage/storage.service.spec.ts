import { TestBed } from '@angular/core/testing';
import { StorageService } from './storgae.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should get the token from localStorage', () => {
    const tokenName = 'token';
    const tokenValue = '12345';
    localStorage.setItem(tokenName, tokenValue);

    const token = service.getToken(tokenName);
    expect(token).toBe(tokenValue);
  });

  it('should set the token in localStorage', () => {
    const tokenName = 'token';
    const tokenValue = '12345';

    service.setToken(tokenValue, tokenName);

    const token = localStorage.getItem(tokenName);
    expect(token).toBe(tokenValue);
  });

  it('should use default tokenName if not provided in getToken', () => {
    service.tokenName = 'defaultToken';
    const tokenValue = '67890';
    localStorage.setItem(service.tokenName, tokenValue);

    const token = service.getToken();
    expect(token).toBe(tokenValue);
  });

  it('should use default tokenName if not provided in setToken', () => {
    service.tokenName = 'defaultToken';
    const tokenValue = '67890';

    service.setToken(tokenValue);

    const token = localStorage.getItem(service.tokenName);
    expect(token).toBe(tokenValue);
  });
});
