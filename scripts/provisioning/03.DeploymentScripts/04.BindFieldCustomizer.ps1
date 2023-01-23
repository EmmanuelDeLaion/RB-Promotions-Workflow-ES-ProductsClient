$ListName="Promociones" #Promociones
$FieldName="PromoLink" #Internal Name

#Setup the context
$Ctx = Get-PnPContext

#Get the List
$List=$Ctx.Web.Lists.GetByTitle($ListName)

#Get the List Field
$Field=$List.Fields.GetByInternalNameOrTitle($FieldName)
$Ctx.Load($Field)
$Ctx.ExecuteQuery()

#e710acda-bc0c-4695-8390-5229e3fc8eaf
#4ed10681-c755-4ed9-adba-c7cbb9d8542a
$Field.ClientSideComponentId = "afecc168-4f0d-476d-8e75-2782b7257c34"


#Apply changes
$Field.Update()
$Ctx.ExecuteQuery()

Write-host "Field Settings Updated!"
