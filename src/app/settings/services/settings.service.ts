import { Observable } from 'rxjs';

import { Settings } from '../models/settings.model';

export abstract class SettingsService {
  abstract getSettings(): Observable<Settings>;

  abstract updateSettings(settings: Settings): Observable<Settings>;
}
