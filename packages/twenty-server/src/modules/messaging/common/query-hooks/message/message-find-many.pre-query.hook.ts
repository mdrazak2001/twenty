import { BadRequestException, NotFoundException } from '@nestjs/common';

import { WorkspaceQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { FindManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { InjectWorkspaceRepository } from 'src/engine/twenty-orm/decorators/inject-workspace-repository.decorator';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { CanAccessMessageThreadService } from 'src/modules/messaging/common/query-hooks/message/can-access-message-thread.service';
import { MessageChannelMessageAssociationWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-channel-message-association.workspace-entity';

@WorkspaceQueryHook(`message.findMany`)
export class MessageFindManyPreQueryHook implements WorkspaceQueryHookInstance {
  constructor(
    @InjectWorkspaceRepository(MessageChannelMessageAssociationWorkspaceEntity)
    private readonly messageChannelMessageAssociationRepository: WorkspaceRepository<MessageChannelMessageAssociationWorkspaceEntity>,
    private readonly canAccessMessageThreadService: CanAccessMessageThreadService,
  ) {}

  async execute(
    userId: string,
    workspaceId: string,
    payload: FindManyResolverArgs,
  ): Promise<void> {
    if (!payload?.filter?.messageThreadId?.eq) {
      throw new BadRequestException('messageThreadId filter is required');
    }

    const messageChannelMessageAssociations =
      await this.messageChannelMessageAssociationRepository.find({
        where: {
          messageThread: {
            id: payload?.filter?.messageThreadId?.eq,
          },
        },
      });

    if (messageChannelMessageAssociations.length === 0) {
      throw new NotFoundException();
    }

    await this.canAccessMessageThreadService.canAccessMessageThread(
      userId,
      workspaceId,
      messageChannelMessageAssociations,
    );
  }
}
