import React from 'react';
import { connect } from 'react-redux';

import { MAP_COUNTRY_TOOLTIP_KEY } from '../../helpers/constants';
import { __, getFullZoneName } from '../../helpers/translation';
import { getCo2Scale } from '../../helpers/scales';
import { co2Sub, formatCarbonIntensityShortUnit } from '../../helpers/formatting';
import { flagUri } from '../../helpers/flags';
import { getCarbonIntensity, getRenewableRatio, getLowcarbonRatio } from '../../selectors';

import CircularGauge from '../circulargauge';
import Tooltip from '../tooltip';
import { ZoneName } from './common';

const mapStateToProps = state => ({
  colorBlindModeEnabled: state.application.colorBlindModeEnabled,
  tooltipData: state.application.tooltipData,
  electricityMixMode: state.application.electricityMixMode,
  visible: state.application.tooltipDisplayMode === MAP_COUNTRY_TOOLTIP_KEY,
  carbonIntensityDomain: state.application.carbonIntensityDomain,
});

const MapCountryTooltip = ({
  colorBlindModeEnabled,
  tooltipData,
  electricityMixMode,
  visible,

  carbonIntensityDomain,
}) => {
  if (!visible || !tooltipData) return null;

  const countryData = tooltipData;
  const { countryCode, year } = tooltipData;

  const co2ColorScale = getCo2Scale(colorBlindModeEnabled, carbonIntensityDomain);
  const co2intensity = getCarbonIntensity(carbonIntensityDomain, electricityMixMode, countryData);

  const lowcarbonRatio = getLowcarbonRatio(electricityMixMode, countryData);
  const lowcarbonPercentage = lowcarbonRatio !== null
    ? Math.round(100 * lowcarbonRatio)
    : '?';

  const renewableRatio = getRenewableRatio(electricityMixMode, countryData);
  const renewablePercentage = renewableRatio !== null
    ? Math.round(100 * renewableRatio)
    : '?';

  return (
    <Tooltip id="country-tooltip">
      <div className="zone-name-header">
        <ZoneName zone={countryCode} />
      </div>
      {true ? (
        co2intensity ? (
          <div className="zone-details">
            <div className="country-table-header-inner">
              <div className="country-col country-emission-intensity-wrap">
                <div
                  id="country-emission-rect"
                  className="country-col-box emission-rect emission-rect-overview"
                  style={{ backgroundColor: co2ColorScale(co2intensity) }}
                >
                  <div>
                    <span className="country-emission-intensity">
                      {co2intensity != null ? Math.round(co2intensity) : '?'}
                    </span>
                    {formatCarbonIntensityShortUnit(carbonIntensityDomain)}
                  </div>
                </div>
                <div
                  className="country-col-headline"
                  dangerouslySetInnerHTML={{ __html: co2Sub(__('country-panel.carbonintensity')) }}
                />
              </div>
              <div className="country-col country-lowcarbon-wrap">
                <div id="tooltip-country-lowcarbon-gauge" className="country-gauge-wrap">
                  <CircularGauge percentage={lowcarbonPercentage} />
                </div>
                <div
                  className="country-col-headline"
                  dangerouslySetInnerHTML={{ __html: co2Sub(__('country-panel.lowcarbon')) }}
                />
                <div className="country-col-subtext" />
              </div>
              <div className="country-col country-renewable-wrap">
                <div id="tooltip-country-renewable-gauge" className="country-gauge-wrap">
                  <CircularGauge percentage={renewablePercentage} />
                </div>
                <div className="country-col-headline">{__('country-panel.renewable')}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="temporary-outage-text">
            {__('tooltips.temporaryDataOutage')}
          </div>
        )
      ) : (
        <div className="no-parser-text">
          <span dangerouslySetInnerHTML={{ __html: __('tooltips.noParserInfo', 'https://github.com/tmrowco/electricitymap-contrib#adding-a-new-region') }} />
        </div>
      )}
    </Tooltip>
  );
};

export default connect(mapStateToProps)(MapCountryTooltip);
