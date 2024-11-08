import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { SignInUpMode, useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SignInUpStep } from '@/auth/states/signInUpStepState';
import { isDefined } from '~/utils/isDefined';
import { useWorkspacePublicData } from '@/auth/sign-in-up/hooks/useWorkspacePublicData';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import {
  isTwentyHomePage,
  isTwentyWorkspaceSubdomain,
} from '~/utils/workspace-url.helper';
import { SignInUpWorkspaceSelection } from '@/auth/sign-in-up/components/SignInUpWorkspaceSelection';
import { SignInUpGlobalScope } from '@/auth/sign-in-up/components/SignInUpGlobalScope';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { AnimatedEaseIn } from 'twenty-ui';
import { Logo } from '@/auth/components/Logo';
import { Title } from '@/auth/components/Title';
import { SignInUpForm } from '@/auth/sign-in-up/components/SignInUpForm';
import { DEFAULT_WORKSPACE_NAME } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceName';

export const SignInUp = () => {
  const { form } = useSignInUpForm();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  const { signInUpStep, signInUpMode } = useSignInUp(form);

  const { loading } = useWorkspacePublicData();

  const workspacePublicData = useRecoilValue(workspacePublicDataState);

  const title = useMemo(() => {
    if (
      signInUpStep === SignInUpStep.Init ||
      signInUpStep === SignInUpStep.Email
    ) {
      return `Welcome to ${workspacePublicData?.displayName ?? 'Twenty'}`;
    }
    if (signInUpStep === SignInUpStep.WorkspaceSelection) {
      return 'Choose a workspace';
    }
    return signInUpMode === SignInUpMode.SignIn
      ? `Sign in to ${workspacePublicData?.displayName ?? 'Twenty'}`
      : `Sign up to ${workspacePublicData?.displayName ?? 'Twenty'}`;
  }, [signInUpMode, signInUpStep, workspacePublicData]);

  if (isDefined(currentWorkspace)) {
    return <></>;
  }

  return (
    <>
      <AnimatedEaseIn>
        <Logo workspaceLogo={workspacePublicData?.logo} />
      </AnimatedEaseIn>
      <Title animate>
        {`Welcome to ${workspacePublicData?.displayName ?? DEFAULT_WORKSPACE_NAME}`}
      </Title>
      {isTwentyHomePage ? (
        isTwentyHomePage && signInUpStep === SignInUpStep.WorkspaceSelection ? (
          <SignInUpWorkspaceSelection />
        ) : (
          <SignInUpGlobalScope />
        )
      ) : (
        <SignInUpForm />
      )}
      <FooterNote />
    </>
  );
};
