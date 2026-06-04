#!/usr/bin/env node
"use strict";

const { printSigningStatus, resolveSigningStatus } = require("../signing/signingWorkflowHelpers.cjs");

const result = resolveSigningStatus();
printSigningStatus(result);
