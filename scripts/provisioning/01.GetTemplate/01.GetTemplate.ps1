$siteUrl = "https://spme.sharepoint.com/sites/RB-Promociones"
$userName = "testuser.nine@spme.onmicrosoft.com"
$pwd = "Password1"

$Credentials = New-Object System.Management.Automation.PSCredential ($userName, (ConvertTo-SecureString $pwd -AsPlainText -Force))
Connect-PnPOnline -Url $siteUrl –Credentials $Credentials

$templatePath = "../template.xml"
Get-PnPProvisioningTemplate -Out $templatePath -IncludeAllClientSidePages -Force -Handlers "Lists", "Pages" -ListsToExtract "Aprobadores", "Canales", "Categorías", "Categorías de producto", "Clientes", "Configuración", "Evidencias", "Marcas", "NotificationTemplates", "Productos", "Productos por cliente", "Promo items", "Promociones", "Subcanales", "SYS_PermissionChangeRequests", "Tipos", "Unidades de negocio", "Volúmenes del último año", "Workflow log"


Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Aprobadores' -Query '' -Fields 'Role'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Canales' -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Subcanales' -Query '' -Fields 'Title','Channel'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Categorías' -Query '' -Fields 'Title', 'SYS_Identifier'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Tipos' -Query '' -Fields 'Title','Category'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Categorías de producto" -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Clientes' -Query '' -Fields 'Title','Channel','Subchannel'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List 'Configuración' -Query '' -Fields 'Title','Value'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Marcas" -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "NotificationTemplates" -Query '' -Fields 'Title', 'To', 'Cc', 'Subject', 'Body'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Unidades de negocio" -Query '' -Fields 'Title'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Productos" -Query '' -Fields 'Title','SKUDescription','BusinessUnit','Brand','ProductCategory'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Productos por cliente" -Query '' -Fields 'Title','Client','Product','Price','COGS'
Add-PnPDataRowsToProvisioningTemplate -Path $templatePath -List "Volúmenes del último año" -Query '' -Fields 'Title','Client','Product','Volume01','Volume02','Volume03','Volume04','Volume05','Volume06','Volume07','Volume08','Volume09','Volume10','Volume11','Volume12'