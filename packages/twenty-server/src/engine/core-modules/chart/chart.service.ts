import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ChartResult } from 'src/engine/core-modules/chart/dtos/chart-result.dto';
import { AliasPrefix } from 'src/engine/core-modules/chart/types/alias-prefix.type';
import { JoinOperation } from 'src/engine/core-modules/chart/types/join-operation.type';
import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/field-metadata.service';
import { computeColumnName } from 'src/engine/metadata-modules/field-metadata/utils/compute-column-name.util';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import {
  RelationMetadataEntity,
  RelationMetadataType,
} from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { computeObjectTargetTable } from 'src/engine/utils/compute-object-target-table.util';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import {
  ChartMeasure,
  ChartWorkspaceEntity,
} from 'src/modules/charts/standard-objects/chart.workspace-entity';

// TODO:
// 1. Add groupBy support
// 2. Composite type support (most importantly for currencies)

@Injectable()
export class ChartService {
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly objectMetadataService: ObjectMetadataService,
    @InjectRepository(RelationMetadataEntity, 'metadata')
    private readonly relationMetadataRepository: Repository<RelationMetadataEntity>,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  private async getRelationMetadata(
    workspaceId: string,
    fieldMetadataId?: string,
  ) {
    if (!fieldMetadataId) return;
    const [relationMetadata] = await this.relationMetadataRepository.find({
      where: [
        {
          fromFieldMetadataId: fieldMetadataId,
        },
        {
          toFieldMetadataId: fieldMetadataId,
        },
      ],
      relations: [
        'fromObjectMetadata',
        'toObjectMetadata',
        'fromFieldMetadata',
        'toFieldMetadata',
        'fromObjectMetadata.fields',
        'toObjectMetadata.fields',
      ],
    });

    if (relationMetadata instanceof NotFoundException) throw relationMetadata;

    return relationMetadata;
  }

  private async getOppositeObjectMetadata(
    relationMetadata: RelationMetadataEntity,
    objectMetadata: ObjectMetadataEntity,
  ) {
    const oppositeObjectMetadata =
      relationMetadata?.fromObjectMetadataId === objectMetadata.id
        ? relationMetadata?.toObjectMetadata
        : relationMetadata?.fromObjectMetadata;

    if (!oppositeObjectMetadata) throw new Error();

    return oppositeObjectMetadata;
  }

  private computeJoinTableAlias(aliasPrefix: AliasPrefix, i: number) {
    return `table_${aliasPrefix}_${i}`;
  }

  private getJoinOperation(
    objectMetadata: ObjectMetadataEntity,
    index: number,
    sourceTableName: string,
    aliasPrefix: AliasPrefix,
    oppositeObjectMetadata: ObjectMetadataEntity,
    relationMetadata: RelationMetadataEntity,
  ): JoinOperation | undefined {
    const fromIsExistingTable =
      relationMetadata?.fromObjectMetadataId === objectMetadata.id;
    const toJoinFieldName = computeColumnName(
      relationMetadata.toFieldMetadata.name,
      {
        isForeignKey: true,
      },
    );
    const fromJoinFieldName = 'id';

    switch (relationMetadata?.relationType) {
      case RelationMetadataType.ONE_TO_MANY: {
        return {
          joinTableName: computeObjectTargetTable(oppositeObjectMetadata),
          joinTableAlias: this.computeJoinTableAlias(aliasPrefix, index),
          joinFieldName: fromIsExistingTable
            ? toJoinFieldName
            : fromJoinFieldName,
          existingTableAlias:
            index === 0
              ? sourceTableName
              : this.computeJoinTableAlias(aliasPrefix, index - 1),
          existingFieldName: fromIsExistingTable
            ? fromJoinFieldName
            : toJoinFieldName,
        };
      }
      default:
        throw new Error(
          `Chart query construction is not implemented for relation type '${relationMetadata?.relationType}'`,
        );
    }
  }

  private async getJoinOperations(
    workspaceId: string,
    sourceObjectNameSingular: string,
    fieldPath: string[],
    aliasPrefix: AliasPrefix,
  ) {
    if (fieldPath.length < 2) return [];
    let objectMetadata =
      await this.objectMetadataService.findOneOrFailWithinWorkspace(
        workspaceId,
        {
          where: { nameSingular: sourceObjectNameSingular },
        },
      );
    const sourceTableName = computeObjectTargetTable(objectMetadata);
    const tables: JoinOperation[] = [];

    for (let i = 0; i < fieldPath.length; i++) {
      const fieldMetadataId = fieldPath[i];

      const relationMetadata = await this.getRelationMetadata(
        workspaceId,
        fieldMetadataId,
      );

      if (!relationMetadata) break;

      const oppositeObjectMetadata = await this.getOppositeObjectMetadata(
        relationMetadata,
        objectMetadata,
      );

      const joinOperation = this.getJoinOperation(
        objectMetadata,
        i,
        sourceTableName,
        aliasPrefix,
        oppositeObjectMetadata,
        relationMetadata,
      );

      if (!joinOperation) break;

      tables.push(joinOperation);
      objectMetadata = oppositeObjectMetadata;
    }

    return tables;
  }

  private getJoinClauses(
    dataSourceSchema: string,
    joinOperations: JoinOperation[],
  ): string[] {
    return joinOperations.map((joinOperation, i) => {
      return `JOIN "${dataSourceSchema}"."${joinOperation.joinTableName}" "${joinOperation.joinTableAlias}" ON "${joinOperation.existingTableAlias}"."${joinOperation.existingFieldName}" = "${joinOperation.joinTableAlias}"."${
        joinOperation.joinFieldName
      }"`;
    });
  }

  /**
   *
   * @param chartMeasure
   * @param targetColumnName e.g. 'table_1.employees'
   * @returns
   */
  private getMeasureSelectColumn(
    chartMeasure: ChartMeasure,
    targetTableAlias: string,
    targetColumnName?: string,
  ) {
    if (!targetColumnName && chartMeasure !== ChartMeasure.COUNT) {
      throw new Error(
        'Chart measure must be count when target column is undefined',
      );
    }

    switch (chartMeasure) {
      case ChartMeasure.COUNT:
        return 'COUNT(*) as measure';
      case ChartMeasure.AVERAGE:
        return `AVG("${targetTableAlias}"."${targetColumnName}") as measure`;
      case ChartMeasure.MIN:
        return `MIN("${targetTableAlias}"."${targetColumnName}") as measure`;
      case ChartMeasure.MAX:
        return `MAX("${targetTableAlias}"."${targetColumnName}") as measure`;
      case ChartMeasure.SUM:
        return `SUM("${targetTableAlias}"."${targetColumnName}") as measure`;
    }
  }

  private async getTableAliasAndColumn(
    workspaceId: string,
    joinOperations: JoinOperation[],
    sourceTableName: string,
    firstFieldMetadataId?: string,
  ) {
    if (joinOperations.length > 0) {
      const lastJoinOperation = joinOperations[joinOperations.length - 1];

      return {
        targetTableAlias: lastJoinOperation.joinTableAlias,
        targetColumnName: lastJoinOperation.joinFieldName,
      };
    }

    return {
      targetTableAlias: sourceTableName,
      targetColumnName: (
        await this.fieldMetadataService.findOneWithinWorkspace(workspaceId, {
          where: {
            id: firstFieldMetadataId,
          },
        })
      )?.name,
    };
  }

  async run(workspaceId: string, chartId: string): Promise<ChartResult> {
    const repository =
      await this.twentyORMManager.getRepository(ChartWorkspaceEntity);
    const chart = await repository.findOneByOrFail({ id: chartId });

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const sourceObjectMetadata =
      await this.objectMetadataService.findOneOrFailWithinWorkspace(
        workspaceId,
        {
          where: { nameSingular: chart?.sourceObjectNameSingular },
        },
      );

    const sourceTableName = computeObjectTargetTable(sourceObjectMetadata);

    const targetJoinOperations = await this.getJoinOperations(
      workspaceId,
      chart.sourceObjectNameSingular,
      chart.fieldPath,
      'target',
    );

    const targetJoinClauses = this.getJoinClauses(
      dataSourceSchema,
      targetJoinOperations,
    ).join('\n');

    const { targetTableAlias, targetColumnName } =
      await this.getTableAliasAndColumn(
        workspaceId,
        targetJoinOperations,
        sourceTableName,
        chart.fieldPath[0],
      );

    /* const groupByJoinOperations = await this.getJoinOperations(
      workspaceId,
      chart.sourceObjectNameSingular,
      chart.groupBy,
      'group_by',
    );

    const lastGroupByJoinOperation =
      groupByJoinOperations[groupByJoinOperations.length - 1];

    const groupByTableName =
      groupByJoinOperations.length > 0
        ? lastGroupByJoinOperation.joinTableAlias
        : sourceTableName;

    const groupByClause =
      chart?.groupBy && chart?.groupBy.length > 0
        ? `GROUP BY "${groupByTableName}"."${groupByColumnName}"`
        : undefined; */

    const measureSelectColumn = this.getMeasureSelectColumn(
      chart.measure,
      targetTableAlias,
      targetColumnName,
    );

    const selectColumns = [measureSelectColumn /* groupByColumn */].filter(
      (col) => !!col,
    );

    const joinClauses = [targetJoinClauses /* groupByJoinClauses */].join('\n');

    const sqlQuery = `
      SELECT ${selectColumns.join(', ')}
      FROM "${dataSourceSchema}"."${sourceTableName}"
      ${joinClauses}
      ${'' /* groupByClause */};
    `;

    console.log('sqlQuery\n', sqlQuery);

    const result = await this.workspaceDataSourceService.executeRawQuery(
      sqlQuery,
      [],
      workspaceId,
    );

    console.log('result', JSON.stringify(result, undefined, 2));

    return { chartResult: JSON.stringify(result) };
  }
}
