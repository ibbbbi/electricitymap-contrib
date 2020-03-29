import React from 'react';
import { connect } from 'react-redux';

import { CARBON_INTENSITY_DOMAIN } from '../helpers/constants';
import { updateApplication } from '../actioncreators';

// TODO: Move styles from styles.css to here

const mapStateToProps = state => ({
  carbonIntensityDomain: state.application.carbonIntensityDomain,
});
const mapDispatchToProps = dispatch => ({
  setDomain: value => dispatch(updateApplication('carbonIntensityDomain', value)),
});

const configuration = [
  { key: CARBON_INTENSITY_DOMAIN.POPULATION, label: 'population' },
  { key: CARBON_INTENSITY_DOMAIN.GDP, label: 'gdp' },
  { key: CARBON_INTENSITY_DOMAIN.ENERGY, label: 'energy' },
];

export default connect(mapStateToProps, mapDispatchToProps)(({ carbonIntensityDomain, setDomain }) => (
  <div className="prodcons-toggle-container">
    <div className="production-toggle">
      {configuration.map(c => (
        <div
          key={c.key}
          className={`production-toggle-item production ${carbonIntensityDomain === c.key ? 'production-toggle-active-overlay' : ''}`}
          onClick={() => setDomain(c.key)}
        >
          {c.label}
        </div>
      ))}
    </div>
    <div className="production-toggle-info">
      i
    </div>
    <div id="production-toggle-tooltip" className="layer-button-tooltip hidden">
      <div className="tooltip-container">
        <div className="tooltip-text">
          TODO
        </div>
        <div className="arrow" />
      </div>
    </div>
  </div >
));
