$siteUrl = "https://sgiovannini.sharepoint.com/sites/RB-Promociones/Mexico"
$listName="Aprobadores"
$clientId = "07de5ad1-f5dc-4175-97f5-5efcbe8dc488"
$clientSecret = "r+q2pDOy12bBZU0iFtP5oETSgoUQgEDVZVrfHTfLK0U="

$currentTime= $(get-date).ToString("yyyyMMddHHmmss")  
$logFilePath=".\log-"+$currentTime+".docx"  
# Fields that has to be retrieved  
$Global:selectProperties=@("Title");  

Connect-PnPOnline -Url $siteUrl -ClientId $clientId -ClientSecret $clientSecret

#/_layouts/15/appregnew.aspx
#El identificador de la aplicación se ha creado correctamente.
#Id. de cliente:     07de5ad1-f5dc-4175-97f5-5efcbe8dc488
#Clave secreta de cliente:   r+q2pDOy12bBZU0iFtP5oETSgoUQgEDVZVrfHTfLK0U=
#Título:     RBBatchScripts
#Dominio de aplicación:      www.baufest.com
#Dirección URI de redireccionamiento:    https://sgiovannini.sharepoint.com/sites/RB-Promociones

#/_layouts/15/AppInv.aspx
#    <AppPermissionRequests AllowAppOnlyPolicy="true">
#    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl"/>
#    <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="FullControl"/>
#    </AppPermissionRequests>

## Start the Transcript  
Start-Transcript -Path $logFilePath   
  
## Export List to CSV ##  
function ExportList  
{  
    try  
    {  
        # Get all list items using PnP cmdlet  
        $listItems=(Get-PnPListItem -List $listName -Fields $Global:selectProperties).FieldValues  
        $outputFilePath=".\results-"+$currentTime+".csv"  
  
        $hashTable=@()  
 
        # Loop through the list items  
        foreach($listItem in $listItems)  
        {  
            $obj=New-Object PSObject              
            $listItem.GetEnumerator() | Where-Object { $_.Key -in $Global:selectProperties }| ForEach-Object{ $obj | Add-Member Noteproperty $_.Key $_.Value}  
            $hashTable+=$obj;  
            $obj=$null;  
        }  
  
        $hashtable | export-csv $outputFilePath -NoTypeInformation  
     }  
     catch [Exception]  
     {  
        $ErrorMessage = $_.Exception.Message         
        Write-Host "Error: $ErrorMessage" -ForegroundColor Red          
     }  
}  

## Call the Function  
ExportList  
 
## Disconnect the context  
Disconnect-PnPOnline  
 
## Stop Transcript  
Stop-Transcript  