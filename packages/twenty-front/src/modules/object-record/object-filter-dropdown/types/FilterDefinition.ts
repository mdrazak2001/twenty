import { IconComponent } from 'twenty-ui';

import { FilterableFieldType } from './FilterableFieldType';

export type FilterDefinition = {
  fieldMetadataId: string;
  label: string;
  iconName: string;
  type: FilterableFieldType;
  relationObjectMetadataNamePlural?: string;
  relationObjectMetadataNameSingular?: string;
  selectAllLabel?: string;
  SelectAllIcon?: IconComponent;
  subFieldName?: string;
};
