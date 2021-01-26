$siteUrl = "https://spme.sharepoint.com/sites/RB-Promociones/Mexico"
$userName = "testuser.nine@spme.onmicrosoft.com"
$pwd = "Password1"

$Credentials = New-Object System.Management.Automation.PSCredential ($userName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl -Credentials $Credentials

Apply-PnPProvisioningTemplate -Path template.xml -Handlers Lists