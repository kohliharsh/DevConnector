import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alerts.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProp = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProp)(alert);
