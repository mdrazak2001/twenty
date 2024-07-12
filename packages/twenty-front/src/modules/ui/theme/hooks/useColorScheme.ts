import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { WorkspaceMemberColorSchemeEnum } from '~/generated/graphql';

export const useColorScheme = () => {
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useRecoilState(
    currentWorkspaceMemberState,
  );

  const { updateOneRecord: updateOneWorkspaceMember } = useUpdateOneRecord({
    objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  });

  const colorScheme =
    currentWorkspaceMember?.colorScheme ??
    WorkspaceMemberColorSchemeEnum.System;

  const setColorScheme = useCallback(
    async (value: WorkspaceMemberColorSchemeEnum) => {
      if (!currentWorkspaceMember) {
        return;
      }
      setCurrentWorkspaceMember((current) => {
        if (!current) {
          return current;
        }
        return {
          ...current,
          colorScheme: value,
        };
      });
      await updateOneWorkspaceMember?.({
        idToUpdate: currentWorkspaceMember?.id,
        updateOneRecordInput: {
          colorScheme: value,
        },
      });
    },
    [
      currentWorkspaceMember,
      setCurrentWorkspaceMember,
      updateOneWorkspaceMember,
    ],
  );

  return {
    colorScheme,
    setColorScheme,
  };
};
