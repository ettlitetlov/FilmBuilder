import { TestBed, inject } from '@angular/core/testing';

import { FilmComposerService } from './film-composer.service';

describe('FilmComposerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilmComposerService]
    });
  });

  it('should be created', inject([FilmComposerService], (service: FilmComposerService) => {
    expect(service).toBeTruthy();
  }));
});
