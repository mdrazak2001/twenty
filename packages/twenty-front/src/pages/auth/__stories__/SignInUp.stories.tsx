import { getOperationName } from '@apollo/client/utilities';
import { Meta, StoryObj } from '@storybook/react';
import { fireEvent, within } from '@storybook/test';
import { HttpResponse, graphql } from 'msw';

import { GET_CURRENT_USER } from '@/users/graphql/queries/getCurrentUser';
import {
  PageDecorator,
  PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { AppPath } from '@/types/AppPath';
import { SignInUp } from '../SignInUp';
import { GET_PUBLIC_WORKSPACE_DATA_BY_SUBDOMAIN } from '@/auth/graphql/queries/getPublicWorkspaceDataBySubdomain';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Auth/SignInUp',
  component: SignInUp,
  decorators: [PageDecorator],
  args: { routePath: AppPath.SignInUp },
  parameters: {
    msw: {
      handlers: [
        graphql.query(
          getOperationName(GET_PUBLIC_WORKSPACE_DATA_BY_SUBDOMAIN) ?? '',
          () => {
            return HttpResponse.json({
              data: {
                id: 'id',
                logo: 'logo',
                displayName: 'displayName',
                authProviders: {
                  google: true,
                  microsoft: false,
                  password: true,
                  magicLink: false,
                  sso: [],
                },
              },
            });
          },
        ),
        graphql.query(getOperationName(GET_CURRENT_USER) ?? '', () => {
          return HttpResponse.json({
            data: null,
            errors: [
              {
                message: 'Unauthorized',
                extensions: {
                  code: 'UNAUTHENTICATED',
                  response: {
                    statusCode: 401,
                    message: 'Unauthorized',
                  },
                },
              },
            ],
          });
        }),
        graphqlMocks.handlers,
      ],
    },
    cookie: '',
  },
};

export default meta;

export type Story = StoryObj<typeof SignInUp>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const continueWithEmailButton = await canvas.findByText(
      'Continue With Email',
    );

    await fireEvent.click(continueWithEmailButton);
  },
};
