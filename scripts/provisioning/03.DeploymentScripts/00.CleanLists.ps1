function CleanList($listName)
{
    Write-Host "Starting to clean list" $listName
    $items =Get-PnPListItem -List $listName -PageSize 500

    foreach ($item in $items)
    {
        try
        {
            Remove-PnPListItem -List $listName -Identity $item.Id -Force
        }
        catch
        {
            Write-Host "Error Occurred While Deleting the Item from the SharePoint Online List"
        }
    }
}


CleanList "Aprobadores"
CleanList "Canales"
CleanList 'Categor�as'
CleanList "Categor�as de producto"
CleanList "Clientes"
CleanList "Configuraci�n" 
CleanList "Marcas"
CleanList "NotificationTemplates"
CleanList "Productos"
CleanList "Productos por cliente"
CleanList "Subcanales"
CleanList "Tipos" 
CleanList "Unidades de negocio"
CleanList "Vol�menes del �ltimo a�o"

CleanList "EmailSender"

CleanList "Promo items"
CleanList "Promociones"
CleanList "Workflow log"