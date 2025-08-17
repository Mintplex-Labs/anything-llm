#!/usr/bin/env bash
rg -n "(bg|text|border)-(gray|slate|zinc|stone|neutral|white|black)-|#[0-9a-fA-F]{3,6}" frontend/src || true
