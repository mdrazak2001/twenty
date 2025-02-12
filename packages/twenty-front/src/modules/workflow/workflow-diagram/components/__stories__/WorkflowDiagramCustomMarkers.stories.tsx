import styled from '@emotion/styled';
import { Meta, StoryObj } from '@storybook/react';
import { RecoilRoot } from 'recoil';

import { WorkflowDiagramCreateStepNode } from '@/workflow/workflow-diagram/components/WorkflowDiagramCreateStepNode';
import { WorkflowDiagramDefaultEdge } from '@/workflow/workflow-diagram/components/WorkflowDiagramDefaultEdge';
import { WorkflowDiagramEmptyTrigger } from '@/workflow/workflow-diagram/components/WorkflowDiagramEmptyTrigger';
import { WorkflowDiagramStepNodeReadonly } from '@/workflow/workflow-diagram/components/WorkflowDiagramStepNodeReadonly';
import { WorkflowDiagramSuccessEdge } from '@/workflow/workflow-diagram/components/WorkflowDiagramSuccessEdge';
import { WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION } from '@/workflow/workflow-diagram/constants/WorkflowVisualizerEdgeDefaultConfiguration';
import { WORKFLOW_VISUALIZER_EDGE_SUCCESS_CONFIGURATION } from '@/workflow/workflow-diagram/constants/WorkflowVisualizerEdgeSuccessConfiguration';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { ReactflowDecorator } from '~/testing/decorators/ReactflowDecorator';
import { WorkspaceDecorator } from '~/testing/decorators/WorkspaceDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { workflowDiagramState } from '../../states/workflowDiagramState';
import { WorkflowDiagramCanvasBase } from '../WorkflowDiagramCanvasBase';

const StyledContainer = styled.div`
  height: 400px;
  width: 100%;
  position: relative;
`;

const meta: Meta = {
  title: 'Modules/Workflow/WorkflowDiagram/WorkflowDiagramCustomMarkers',
  component: WorkflowDiagramCanvasBase,
  parameters: {
    msw: graphqlMocks,
  },
  decorators: [
    WorkspaceDecorator,
    ObjectMetadataItemsDecorator,
    ReactflowDecorator,
  ],
};

export default meta;

type Story = StoryObj<typeof WorkflowDiagramCanvasBase>;

export const DefaultEdge: Story = {
  args: {
    status: 'DRAFT',
    nodeTypes: {
      default: WorkflowDiagramStepNodeReadonly,
      'create-step': WorkflowDiagramCreateStepNode,
      'empty-trigger': WorkflowDiagramEmptyTrigger,
    },
    edgeTypes: {
      default: WorkflowDiagramDefaultEdge,
    },
  },
  decorators: [
    (Story) => (
      <RecoilRoot
        initializeState={({ set }) => {
          set(workflowDiagramState, {
            nodes: [
              {
                id: 'trigger-1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: {
                  nodeType: 'trigger',
                  triggerType: 'DATABASE_EVENT',
                  name: 'When record is created',
                  isLeafNode: false,
                },
              },
              {
                id: 'action-1',
                type: 'default',
                position: { x: 300, y: 100 },
                data: {
                  nodeType: 'action',
                  actionType: 'CREATE_RECORD',
                  name: 'Create record',
                  isLeafNode: false,
                },
              },
              {
                id: 'create-step-1',
                type: 'create-step',
                position: { x: 500, y: 100 },
                data: {
                  nodeType: 'create-step',
                  parentNodeId: 'action-1',
                },
              },
            ],
            edges: [
              {
                ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
                id: 'edge-1',
                source: 'trigger-1',
                target: 'action-1',
              },
              {
                ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
                id: 'edge-2',
                source: 'action-1',
                target: 'create-step-1',
              },
            ],
          });
        }}
      >
        <StyledContainer>
          <Story />
        </StyledContainer>
      </RecoilRoot>
    ),
  ],
};

export const SuccessEdge: Story = {
  args: {
    status: 'DRAFT',
    nodeTypes: {
      default: WorkflowDiagramStepNodeReadonly,
      'create-step': WorkflowDiagramCreateStepNode,
      'empty-trigger': WorkflowDiagramEmptyTrigger,
    },
    edgeTypes: {
      default: WorkflowDiagramDefaultEdge,
      success: WorkflowDiagramSuccessEdge,
    },
  },
  decorators: [
    (Story) => (
      <RecoilRoot
        initializeState={({ set }) => {
          set(workflowDiagramState, {
            nodes: [
              {
                id: 'trigger-1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: {
                  nodeType: 'trigger',
                  triggerType: 'DATABASE_EVENT',
                  name: 'When record is created',
                  isLeafNode: false,
                },
              },
              {
                id: 'action-1',
                type: 'default',
                position: { x: 300, y: 100 },
                data: {
                  nodeType: 'action',
                  actionType: 'CREATE_RECORD',
                  name: 'Create record',
                  isLeafNode: false,
                },
              },
            ],
            edges: [
              {
                ...WORKFLOW_VISUALIZER_EDGE_SUCCESS_CONFIGURATION,
                id: 'edge-1',
                source: 'trigger-1',
                target: 'action-1',
                type: 'success',
                label: '1 item',
              },
            ],
          });
        }}
      >
        <StyledContainer>
          <Story />
        </StyledContainer>
      </RecoilRoot>
    ),
  ],
};
