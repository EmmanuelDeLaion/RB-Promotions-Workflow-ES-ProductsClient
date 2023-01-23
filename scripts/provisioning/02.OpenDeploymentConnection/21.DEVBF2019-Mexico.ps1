$siteUrl = "https://devbf2019.sharepoint.com/sites/RBPromociones/Mexico"
$userName = "adminshp@devbf2019.onmicrosoft.com"
$pwd = "baufest_123"

$Credentials = New-Object System.Management.Automation.PSCredential ($userName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl -Credentials $Credentials
