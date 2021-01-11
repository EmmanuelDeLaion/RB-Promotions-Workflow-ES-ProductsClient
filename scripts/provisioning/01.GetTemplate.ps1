$siteUrl = "https://spme.sharepoint.com/sites/RB-Promociones"
$UserName = "testuser.nine@spme.onmicrosoft.com"
$pwd = "Password1"

$Credentials = New-Object System.Management.Automation.PSCredential ($UserName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl �Credentials $Credentials

Get-PnPProvisioningTemplate -Out template.xml -Handlers Lists -ListsToExtract "Canales", "Categor�as", "Clientes", "Promo items", "Promociones", "Subcanales", "Tipos", "Productos", "Unidades de negocio", "Marcas", "Categor�as de producto"

Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Canales' -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Categor�as' -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Clientes' -Query '' -Fields 'Title','Channel','Subchannel'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Subcanales' -Query '' -Fields 'Title','Channel'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List 'Tipos' -Query '' -Fields 'Title','Category'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List "Productos" -Query '' -Fields 'Title','SKUDescription','BusinessUnit','Brand','Category'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List "Unidades de negocio" -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List "Marcas" -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path template.xml -List "Categor�as de producto" -Query '' -Fields 'Title'

