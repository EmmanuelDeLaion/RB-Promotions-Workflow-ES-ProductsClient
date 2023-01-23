function CreateGroup($groupName)
{
    Try
    {
        $group = Get-PnPGroup $groupName
    }
    Catch
    {
    }

    if($group -eq $null)
    {
        New-PnPGroup -Title $groupName
    }
}

Invoke-PnPSiteTemplate -Path "../template.xml" -Handlers Lists

CreateGroup "RB - KAMs - MX"
CreateGroup "RB - Solo consulta - MX"

CreateGroup "RB - KAMs - EC"
CreateGroup "RB - Solo consulta - EC"

CreateGroup "RB - KAMs - CO"
CreateGroup "RB - Solo consulta - CO"

CreateGroup "RB - KAMs - BR"
CreateGroup "RB - Solo consulta - BR"

CreateGroup "RB - KAMs - DR"
CreateGroup "RB - Solo consulta - DR"

CreateGroup "RB - KAMs - PU"
CreateGroup "RB - Solo consulta - PU"


# --TPM_CARCA--
# Republica Dominicana
CreateGroup "RB - KAMs - DO"
CreateGroup "RB - Solo consulta - DO"

# Puerto Rico
CreateGroup "RB - KAMs - PR"
CreateGroup "RB - Solo consulta - PR"

# Haití
CreateGroup "RB - KAMs - HT"
CreateGroup "RB - Solo consulta - HT"


# --TPM_CAM--
# Guatemala
CreateGroup "RB - KAMs - GU"
CreateGroup "RB - Solo consulta - GU"

# Belize
CreateGroup "RB - KAMs - BE"
CreateGroup "RB - Solo consulta - BE"

# Honduras
CreateGroup "RB - KAMs - HN"
CreateGroup "RB - Solo consulta - HN"

# Nicaragua
CreateGroup "RB - KAMs - NI"
CreateGroup "RB - Solo consulta - NI"

# El Salvador
CreateGroup "RB - KAMs - SA"
CreateGroup "RB - Solo consulta - SA"

# Costa Rica
CreateGroup "RB - KAMs - CR"
CreateGroup "RB - Solo consulta - CR"

# Panamá
CreateGroup "RB - KAMs - PN"
CreateGroup "RB - Solo consulta - PN"


