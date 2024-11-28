import { useActionMenuEntries } from '@/action-menu/hooks/useActionMenuEntries';
import {
  ActionMenuEntryScope,
  ActionMenuEntryType,
} from '@/action-menu/types/ActionMenuEntry';
import { useDeleteOneWorkflowVersion } from '@/workflow/hooks/useDeleteOneWorkflowVersion';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { IconTrash, isDefined } from 'twenty-ui';

export const useDiscardWorkflowDraftSingleRecordAction = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { addActionMenuEntry, removeActionMenuEntry } = useActionMenuEntries();

  const { deleteOneWorkflowVersion } = useDeleteOneWorkflowVersion();

  const workflowWithCurrentVersion = useWorkflowWithCurrentVersion(workflowId);

  const registerDiscardWorkflowDraftSingleRecordAction = ({
    position,
  }: {
    position: number;
  }) => {
    if (
      !isDefined(workflowWithCurrentVersion) ||
      !isDefined(workflowWithCurrentVersion.currentVersion.trigger)
    ) {
      return;
    }

    const isDraft =
      workflowWithCurrentVersion.currentVersion.status === 'DRAFT';

    if (!isDraft) {
      return;
    }

    addActionMenuEntry({
      key: 'discard-workflow-draft',
      label: 'Discard Draft',
      position,
      Icon: IconTrash,
      type: ActionMenuEntryType.Standard,
      scope: ActionMenuEntryScope.RecordSelection,
      onClick: () => {
        deleteOneWorkflowVersion({
          workflowVersionId: workflowWithCurrentVersion.currentVersion.id,
        });
      },
    });
  };

  const unregisterDiscardWorkflowDraftSingleRecordAction = () => {
    removeActionMenuEntry('discard-workflow-draft');
  };

  return {
    registerDiscardWorkflowDraftSingleRecordAction,
    unregisterDiscardWorkflowDraftSingleRecordAction,
  };
};