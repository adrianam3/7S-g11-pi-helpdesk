import { TestBed } from '@angular/core/testing';

import { ValidarRolesService } from './validar-roles.service';

describe('ValidarRolesService', () => {
  let service: ValidarRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidarRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
