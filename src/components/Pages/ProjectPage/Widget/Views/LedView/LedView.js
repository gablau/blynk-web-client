import React from 'react';
import { connect } from 'react-redux';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class LedView extends React.Component {
    render() {
        const { widget, value } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Led'} />
                <div className={styles.ledContainer}>
                    <svg width={24} height={24}>
                        <circle r={10} cx={12} cy={12} className={styles.ledCircle} fillOpacity={value / 255} />
                    </svg>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, pinId) || 0,
    };
}

export default connect(
    mapStateToProps,
    {},
)(LedView);
