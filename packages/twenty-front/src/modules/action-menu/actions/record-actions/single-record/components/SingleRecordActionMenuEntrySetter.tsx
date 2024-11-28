import { SingleRecordActionMenuEntrySetterEffect } from '@/action-menu/actions/record-actions/single-record/components/SingleRecordActionMenuEntrySetterEffect';
import { WorkflowSingleRecordActionMenuEntrySetterEffect } from '@/action-menu/actions/record-actions/single-record/workflow-actions/components/WorkflowSingleRecordActionMenuEntrySetterEffect';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';

export const SingleRecordActionMenuEntrySetter = ({
  objectMetadataItem,
}: {
  objectMetadataItem: ObjectMetadataItem;
}) => {
  return (
    <>
      <SingleRecordActionMenuEntrySetterEffect
        objectMetadataItem={objectMetadataItem}
      />
      {objectMetadataItem.nameSingular === CoreObjectNameSingular.Workflow && (
        <WorkflowSingleRecordActionMenuEntrySetterEffect startPosition={3} />
      )}
    </>
  );
};