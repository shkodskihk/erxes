import gql from 'graphql-tag';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Spinner } from '../../common/components';
import { withProps } from '../../common/utils';
import { queries } from '../graphql';
import { IDealMap, IPipeline, IStageMap, StagesQueryResponse } from '../types';
import { PipelineConsumer, PipelineProvider } from './PipelineContext';
import { Stage } from './stage';

const Container = styled.div`
  height: 100%;
  display: inline-flex;
  padding-bottom: 10px;
`;

type Props = {
  pipeline: IPipeline;
  initialDealMap?: IDealMap;
  stageMap?: IStageMap;
};

class WithStages extends React.Component<Props, {}> {
  countStages(obj) {
    return Object.keys(obj).length;
  }

  render() {
    const { initialDealMap, pipeline, stageMap } = this.props;
    const stagesCount = this.countStages(stageMap);

    return (
      <PipelineProvider pipeline={pipeline} initialDealMap={initialDealMap}>
        <PipelineConsumer>
          {({ dealMap, onDragEnd, stageIds }) => (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="pipeline"
                type="STAGE"
                direction="horizontal"
                ignoreContainerClipping={true}
              >
                {provided => (
                  <Container
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {stageIds.map((stageId, index) => (
                      <Stage
                        key={stageId}
                        index={index}
                        length={stagesCount}
                        stage={stageMap && stageMap[stageId]}
                        deals={dealMap[stageId]}
                      />
                    ))}
                  </Container>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </PipelineConsumer>
      </PipelineProvider>
    );
  }
}

type WithStatesQueryProps = {
  stagesQuery: StagesQueryResponse;
} & Props;

const WithStatesQuery = (props: WithStatesQueryProps) => {
  const { stagesQuery } = props;

  if (stagesQuery.loading) {
    return <Spinner />;
  }

  const stages = stagesQuery.dealStages;

  const dealMap: IDealMap = {};
  const stageMap: IStageMap = {};

  for (const stage of stages) {
    dealMap[stage._id] = stage.deals || [];
    stageMap[stage._id] = stage;
  }

  return <WithStages {...props} stageMap={stageMap} initialDealMap={dealMap} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, StagesQueryResponse>(gql(queries.stages), {
      name: 'stagesQuery',
      options: ({ pipeline }) => ({
        fetchPolicy: 'network-only',
        variables: {
          pipelineId: pipeline._id
        }
      })
    })
  )(WithStatesQuery)
);
