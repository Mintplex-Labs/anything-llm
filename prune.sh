#!/usr/bin/env sh
# Port of https://github.com/tj/node-prune to bash
# Also,
#   - fixed "*.ts" being overzealous and killing .d.ts files
#   - added some more file types from https://github.com/npm/npm/issues/5264#issuecomment-259800486
#
# See also:
#   - https://github.com/timoxley/cruft
#   - https://yarnpkg.com/en/docs/cli/autoclean
#   - https://github.com/ModClean/modclean
#
# Prunes common files that are unnecessarily published in npm packages
# when people don't configure `.npmignore` or package.json's `files`
#
# TODO/unclear:
# - *.map files

echo "Removing useless files from node_modules."
echo "Initial node_modules size: "$(du -hs .)
# echo "Files: "$(find node_modules/ -type f | wc -l)

# Common unneeded files
find . -type d -name node_modules -prune -exec find {} -type f \( \
    -iname README -or \
    -iname README.md -or \
    -iname CHANGELOG -or \
    -iname CHANGELOG.md -or \
    -name .editorconfig -or \
    -name .gitmodules -or \
    -name .gitattributes -or \
    -name robot.html -or \
    -name .lint -or \
    -iname Gulpfile.js -or \
    -iname Gruntfile.js -or \
    -name .tern-project -or \
    -name .gitattributes -or \
    -name .editorconfig -or \
    -name .eslintrc -or \
    -name .jshintrc -or \
    -name .npmignore -or \
    -name .flowconfig -or \
    -name .documentup.json -or \
    -name .yarn-metadata.json -or \
    -name .travis.yml -or \
    -name thumbs.db -or \
    -name .tern-port -or \
    -name .ds_store -or \
    -name desktop.ini -or \
    -name npm-debug.log -or \
    -name .npmrc -or \
    -iname LICENSE.txt -or \
    -iname LICENSE.md -or \
    -iname LICENSE-MIT -or \
    -iname LICENSE-MIT.txt -or \
    -iname LICENSE.BSD -or \
    -iname LICENSE-BSD -or \
    -iname LICENSE-jsbn -or \
    -iname LICENSE -or \
    -iname AUTHORS -or \
    -iname CONTRIBUTORS -or \
    -name .yarn-integrity -or \
    -name builderror.log -or \
    -name "*.md" -or \
    -name "*.sln" -or \
    -name "*.obj" -or \
    -name "*.gypi" -or \
    -name "*.vcxproj" -or \
    -name "*.vcxproj.filters" -or \
    \( -name '*.ts' -and \! -name '*.d.ts' \) -or \
    -name "*.jst" -or \
    -name "*.coffee" \
  \) -print0 \; | xargs -0 rm -rf

# Common unneeded directories
find . -type d -name node_modules -prune -exec find {} -type d \( \
    -name __tests__ -or \
    -name test -or \
    -name tests -or \
    -name powered-test -or \
    -name docs -or \
    -name doc -or \
    -name website -or \
    -name images -or \
    -name assets -or \
    -name example -or \
    -name examples -or \
    -name coverage -or \
    -name .nyc_output \
  \) -print0 \; | xargs -0 rm -rf


echo "After pruning: "$(du -hs .)
# echo "Files: "$(find node_modules/ -type f | wc -l)