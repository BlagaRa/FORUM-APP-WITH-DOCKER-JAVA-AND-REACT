# Define the list of directories
$folders = @("auth", "forum", "user")

# Iterate over each folder
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Starting docker-compose in folder '$folder' on a separate process..."
        Start-Process -FilePath "docker-compose" -ArgumentList "up --build" -WorkingDirectory $folder 
    }
    else {
        Write-Host "Folder '$folder' does not exist."
    }
}
do {
    $input = Read-Host -Prompt "Press Enter to exit"
} while ($input -ne "")