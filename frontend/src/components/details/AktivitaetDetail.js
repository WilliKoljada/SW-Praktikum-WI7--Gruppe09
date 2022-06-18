import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography, Paper } from "@material-ui/core";
import ZeiterfassungAPI from "../../api/ZeiterfassungAPI";
import ContextErrorMessage from "../dialogs/ContextErrorMessage";
import LoadingProgress from "../dialogs/LoadingProgress";