import { SelectItem } from 'primeng/api';

export interface FactorySettings {
  moduleRankIds?: string[];
  /** Calculated, not configurable */
  moduleOptions?: SelectItem[];
  beaconCount?: string;
  beaconId?: string;
  beaconModuleRankIds?: string[];
  /** Calculated, not configurable */
  beaconModuleOptions?: SelectItem[];
  overclock?: number;
}
