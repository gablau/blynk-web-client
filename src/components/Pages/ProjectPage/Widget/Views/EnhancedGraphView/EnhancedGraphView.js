import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import * as Immutable from 'immutable';
import { getPinHistory } from '../../../../../../redux/modules/blynk/actions';
import { widgetDataStreamsHistorySelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';
import DataStreamsChart from './DataStreamsChart/DataStreamsChart';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';

export class EnhancedGraphView extends React.Component {
    state = {
        historyIsReady: false,
    };

    async getHistory() {
        const { widget, getPinHistory } = this.props;

        for (const dataStream of widget.get('dataStreams', new Immutable.List())) {
            const pinId = dataStream.getIn(['pin', 'pinId']);
            await getPinHistory(pinId);
        }

        this.setState({
            historyIsReady: true,
        });
    }

    componentDidMount() {
        this.getHistory();
    }

    renderChart() {
        const { widget, dataStreamsHistory } = this.props;

        const showXAxis = widget.get('xAxisValues');

        return (
            <div className={styles.chart}>
                <SizeMe>
                    {({ width, height }) =>
                        !!height && (
                            <DataStreamsChart
                                dataStreams={widget.get('dataStreams')}
                                dataStreamsHistory={dataStreamsHistory}
                                controlBlockRef={this.controlBlockRef}
                                legendBlockRef={this.legendBlockRef}
                                showXAxis={showXAxis}
                                width={width}
                                height={height}
                            />
                        )
                    }
                </SizeMe>
            </div>
        );
    }

    renderLoading() {
        return (
            <div className={styles.loading}>
                <Spinner />
            </div>
        );
    }

    render() {
        const { historyIsReady } = this.state;
        const { widget } = this.props;

        return (
            <>
                <WidgetLabel
                    title={
                        <div className={styles.widgetLabelContainer}>
                            <span className={styles.widgetLabel}>{widget.get('label')}</span>
                            <div
                                ref={i => {
                                    this.legendBlockRef = i;
                                }}
                            />
                        </div>
                    }
                    information={
                        <div
                            ref={i => {
                                this.controlBlockRef = i;
                            }}
                        />
                    }
                    emptyHide={false}
                />
                {historyIsReady ? this.renderChart() : this.renderLoading()}
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        dataStreamsHistory: widgetDataStreamsHistorySelector(state, ownProps.widget),
    };
}

export default connect(
    mapStateToProps,
    {
        getPinHistory,
    },
)(EnhancedGraphView);
