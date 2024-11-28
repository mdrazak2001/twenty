import { useActionMenuEntries } from '@/action-menu/hooks/useActionMenuEntries';
import {
  ActionMenuEntryScope,
  ActionMenuEntryType,
} from '@/action-menu/types/ActionMenuEntry';
import { useActivateWorkflowVersion } from '@/workflow/hooks/useActivateWorkflowVersion';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { IconPower, isDefined } from 'twenty-ui';

export const useActivateWorkflowDraftSingleRecordAction = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { addActionMenuEntry, removeActionMenuEntry } = useActionMenuEntries();

  const { activateWorkflowVersion } = useActivateWorkflowVersion();

  const workflowWithCurrentVersion = useWorkflowWithCurrentVersion(workflowId);

  const registerActivateWorkflowDraftSingleRecordAction = ({
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
      key: 'activate-workflow-draft',
      label: 'Activate Draft',
      position,
      Icon: IconPower,
      type: ActionMenuEntryType.Standard,
      scope: ActionMenuEntryScope.RecordSelection,
      onClick: () => {
        activateWorkflowVersion({
          workflowVersionId: workflowWithCurrentVersion.currentVersion.id,
          workflowId: workflowWithCurrentVersion.id,
        });
      },
    });
  };

  const unregisterActivateWorkflowDraftSingleRecordAction = () => {
    removeActionMenuEntry('activate-workflow-draft');
  };

  return {
    registerActivateWorkflowDraftSingleRecordAction,
    unregisterActivateWorkflowDraftSingleRecordAction,
  };
};