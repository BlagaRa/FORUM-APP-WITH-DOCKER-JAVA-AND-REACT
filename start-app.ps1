# Define the list of directories
$folders = @("auth", "forum", "user")

# Iterate over each folder
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "Starting docker-compose in folder '$folder' on a separate process..."
        
        # Start docker-compose process and capture its details
        $process = Start-Process -FilePath "docker-compose" -ArgumentList "up --build" -WorkingDirectory $folder -PassThru
        
        # Check if the process failed
        if ($process.ExitCode -ne 0) {
            Write-Host "Error: docker-compose failed in folder '$folder' with exit code $($process.ExitCode)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Folder '$folder' does not exist." -ForegroundColor Yellow
    }
}

do {
    $input = Read-Host -Prompt "Press Enter to exit"
} while ($input -ne "")
