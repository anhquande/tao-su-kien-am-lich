git checkout gh-pages
git merge main --no-edit

# 1) Delete everything inside ./docs and ./dist
Write-Host "Cleaning docs and dist folders..."
if (Test-Path "./docs") { Remove-Item "./docs/*" -Recurse -Force }
if (Test-Path "./dist") { Remove-Item "./dist/*" -Recurse -Force }

# 2) Run ng deploy
Write-Host "Running ng deploy..."
ng deploy

# 3) Move everything from ./dist/am-lich-calendar/browser to ./docs
Write-Host "Moving build output to docs..."
$source = "./dist/am-lich-calendar/browser"
$destination = "./docs"

if (!(Test-Path $destination)) {
    New-Item -ItemType Directory -Path $destination | Out-Null
}

Move-Item "$source/*" $destination -Force

# 4) Add everything inside ./docs to git
Write-Host "Adding docs to git..."
git add docs

# 5) Commit and push
Write-Host "Committing and pushing..."
git commit -m "Deploy latest build"
git push

Write-Host "Deployment complete!"
