Write-Host "Removing useless files from dist-server/node_modules."

# Common unneeded files
Get-ChildItem -Path .\ -Filter node_modules -Recurse -Directory | ForEach-Object {
    Get-ChildItem -Path $_.FullName -File -Recurse | Where-Object {
        $_.Name -match "README|README.md|CHANGELOG|CHANGELOG.md|.editorconfig|.gitmodules|.gitattributes|robot.html|.lint|Gulpfile.js|Gruntfile.js|.tern-project|.gitattributes|.editorconfig|.eslintrc|.jshintrc|.npmignore|.flowconfig|.documentup.json|.yarn-metadata.json|.travis.yml|thumbs.db|.tern-port|.ds_store|desktop.ini|npm-debug.log|.npmrc|LICENSE.txt|LICENSE.md|LICENSE-MIT|LICENSE-MIT.txt|LICENSE.BSD|LICENSE-BSD|LICENSE-jsbn|LICENSE|AUTHORS|CONTRIBUTORS|.yarn-integrity|builderror.log|.md|.sln|.obj|.gypi|.vcxproj|.vcxproj.filters|\.ts$" -and $_.Name -notmatch '\.d\.ts$' -and $_.Name -notmatch '\.jst|\.coffee'
    } | Remove-Item -Force -Recurse
}

# Common unneeded directories
Get-ChildItem -Path .\ -Filter node_modules -Recurse -Directory | ForEach-Object {
    Get-ChildItem -Path $_.FullName -Directory -Recurse | Where-Object {
        $_.Name -match "__tests__|test|tests|powered-test|docs|doc|website|images|assets|example|examples|coverage|.nyc_output"
    } | Remove-Item -Force -Recurse
}

Write-Host "node_modules from dist-server pruned!"
