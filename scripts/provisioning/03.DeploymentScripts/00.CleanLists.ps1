function DeleteList($listName)
{
    Write-Host "Starting to delete list" $listName
    Remove-PnPList -Identity $listName -Force
}


DeleteList "Aprobadores"
DeleteList "Canales"
DeleteList 'Categorías'
DeleteList "Categorías de producto"
DeleteList "Clientes"
DeleteList "Configuración" 
DeleteList "Marcas"
DeleteList "NotificationTemplates"
DeleteList "Productos"
DeleteList "Productos por cliente"
DeleteList "Subcanales"
DeleteList "Tipos" 
DeleteList "Unidades de negocio"
DeleteList "Volúmenes del último año"

DeleteList "Promo items"
DeleteList "Promociones"
DeleteList "Workflow log"
DeleteList "SYS_PermissionChangeRequests"
DeleteList "Evidence"