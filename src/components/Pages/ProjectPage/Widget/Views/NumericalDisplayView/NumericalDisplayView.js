import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { numToCssColor } from '../../../../../../utils/color';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class NumericalDisplayView extends React.Component {
    renderValue() {
        const { value, widget } = this.props;

        let valueStr;
        if (isNaN(Number(value))) {
            valueStr = value;
        } else {
            valueStr = parseFloat(Number(value).toFixed(2));
        }

        const valueFormatting = widget.get('valueFormatting');
        if (valueFormatting) {
            valueStr = valueFormatting.replace(/\/pin\//gi, valueStr);
        }

        return <span>{valueStr}</span>;
    }

    render() {
        const { widget } = this.props;

        let fontSize;
        if (widget.get('fontSize') === 'LARGE') {
            fontSize = `20px`;
        } else if (widget.get('fontSize') === 'SMALL') {
            fontSize = `14px`;
        }

        return (
            <div>
                <div className="label">{widget.get('label')}</div>
                <div className={styles.value} style={{ color: numToCssColor(widget.get('color')), fontSize }}>
                    {this.renderValue()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, pinId),
    };
}

export default connect(
    mapStateToProps,
    {},
)(NumericalDisplayView);
