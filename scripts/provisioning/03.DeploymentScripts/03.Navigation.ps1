Get-PnPNavigationNode -Location QuickLaunch | Remove-PnPNavigationNode -Force

Add-PnPNavigationNode -Title "Inicio" -Location "QuickLaunch" -Url ""
Add-PnPNavigationNode -Title "Vista de aprobador" -Location "QuickLaunch" -Url "Lists/Promotions/VistaAprobador.aspx"
Add-PnPNavigationNode -Title "Vista KAM" -Location "QuickLaunch" -Url "Lists/Promotions/VistaKAM.aspx"
Add-PnPNavigationNode -Title "Todas las promociones" -Location "QuickLaunch" -Url "Lists/Promotions/AllItems1.aspx"
Add-PnPNavigationNode -Title "Reportes" -Location "QuickLaunch" -Url ""