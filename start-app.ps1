# Define the list of directories
$folders = @("auth", "forum", "user")

# Iterate over each folder
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Starting docker-compose in folder '$folder' on a separate process..."
        
        # Start docker-compose process and capture its details
        $process = Start-Process -FilePath "docker-compose" -ArgumentList "up --build" -WorkingDirectory $folder -NoNewWindow -PassThru -Wait
        
        # Check if the process failed
        if ($process.ExitCode -ne 0) {
            Write-Host "Error: docker-compose failed in folder '$folder' with exit code $($process.ExitCode)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Folder '$folder' does not exist." -ForegroundColor Yellow
    }
}

# Wait for user input before closing
Read-Host "Press Enter to exit"
