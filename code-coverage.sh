#!/bin/bash
rm -rf coverage
istanbul cover _mocha -- tests/ tests/**/ -R spec

