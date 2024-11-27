import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import {
  Workflow,
  WorkflowWithCurrentVersion,
} from '@/workflow/types/Workflow';
import { useMemo } from 'react';
import { isDefined } from 'twenty-ui';

export const useWorkflowWithCurrentVersion = (
  workflowId: string | undefined,
): WorkflowWithCurrentVersion | undefined => {
  const { record: workflow } = useFindOneRecord<Workflow>({
    objectNameSingular: CoreObjectNameSingular.Workflow,
    objectRecordId: workflowId,
    recordGqlFields: {
      id: true,
      name: true,
      statuses: true,
      versions: true,
    },
    skip: !isDefined(workflowId),
  });

  const workflowWithCurrentVersion = useMemo(() => {
    if (!isDefined(workflow)) {
      return undefined;
    }

    const draftVersion = workflow.versions.find(
      (workflowVersion) => workflowVersion.status === 'DRAFT',
    );
    const latestVersion = workflow.versions.sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1,
    )[0];

    const currentVersion = draftVersion ?? latestVersion;

    if (!isDefined(currentVersion)) {
      return undefined;
    }

    return {
      ...workflow,
      currentVersion,
    };
  }, [workflow]);

  return workflowWithCurrentVersion;
};
