$siteUrl = "https://sgiovannini.sharepoint.com/sites/RB-Promociones/Peru"
$userName = "administrator@sgiovannini.onmicrosoft.com"
$pwd = "Spdevteam4"

$Credentials = New-Object System.Management.Automation.PSCredential ($userName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl -Credentials $Credentials