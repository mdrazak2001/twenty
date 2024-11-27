import { Module } from '@nestjs/common';

import { WorkflowTriggerResolver } from 'src/engine/core-modules/workflow/resolvers/workflow-trigger.resolver';
import { WorkflowBuilderResolver } from 'src/engine/core-modules/workflow/resolvers/workflow-builder.resolver';
import { WorkflowTriggerModule } from 'src/modules/workflow/workflow-trigger/workflow-trigger.module';
import { WorkflowVersionResolver } from 'src/engine/core-modules/workflow/resolvers/workflow-version.resolver';
import { WorkflowBuilderModule } from 'src/modules/workflow/workflow-builder/workflow-builder.module';
import { WorkflowCommonModule } from 'src/modules/workflow/common/workflow-common.module';

@Module({
  imports: [WorkflowTriggerModule, WorkflowBuilderModule, WorkflowCommonModule],
  providers: [
    WorkflowTriggerResolver,
    WorkflowBuilderResolver,
    WorkflowVersionResolver,
  ],
})
export class WorkflowApiModule {}
