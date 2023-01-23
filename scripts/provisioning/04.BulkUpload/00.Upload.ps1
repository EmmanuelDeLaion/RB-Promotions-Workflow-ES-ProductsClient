param ($SiteURL, $ListName, $CSVFilePath)

Function Get-LookupID($ListName, $LookupFieldName, $LookupValue)
{
    $LookupField =  Get-PnPField -List $ListName -Identity $LookupFieldName
    [Xml]$Schema = $LookupField.SchemaXml
    $ParentListID = $Schema.Field.Attributes["List"].'#text'
    $ParentField  = $Schema.field.Attributes["ShowField"].'#text'
    $ParentLookupItem  = Get-PnPListItem -List $ParentListID -Fields $ParentField | Where {$_[$ParentField] -eq $LookupValue} | Select -First 1
    If($ParentLookupItem -ne $Null)  { Return $ParentLookupItem["ID"] }  Else  { Return $Null }
}
 
Try {
    Write-host "V1.3"
    
    Connect-PnPOnline -URL $SiteURL -UseWebLogin
    $CSVData = Import-CSV $CSVFilePath
    $List = Get-PnPList -Identity $ListName
    $ListFields = Get-PnPField -List $ListName | Where { (-Not ($_.ReadOnlyField)) -and (-Not ($_.Hidden)) -and ($_.InternalName -ne  "ContentType") -and ($_.InternalName -ne  "Attachments") }
      
    ForEach($Row in $CSVData)
    {
        Write-host "Row data: " $Row
        
        $ItemValue = @{}           
        $CSVFields = $Row | Get-Member -MemberType NoteProperty | Select -ExpandProperty Name

        Foreach($CSVField in $CSVFields)
        {
            $MappedField = $ListFields | Where {$_.InternalName -eq $CSVField}

            If($MappedField -eq $Null)
            {
                $MappedField = $ListFields | Where {$_.Title -eq $CSVField}
            }

            If($MappedField -ne $Null)
            {
                $FieldName = $MappedField.InternalName
                $value = $Row.$CSVField

                If($Row.$CSVField -ne $Null)
                {
                    $FieldType  = $MappedField.TypeAsString
                    If($FieldType -eq "User" -or $FieldType -eq "UserMulti") #People Picker Field
                    {
                        $PeoplePickerValues = $value.Split(",")
                        $ItemValue.add($FieldName,$PeoplePickerValues)
                    }
                    ElseIf($FieldType -eq "Lookup" -or $FieldType -eq "LookupMulti") #Lookup Field
                    {
                        $LookupIDs = $value.Split(",") | ForEach-Object { Get-LookupID -ListName $ListName -LookupFieldName $FieldName -LookupValue $_ }               
                        $ItemValue.Add($FieldName,$LookupIDs)
                    }
                    Else
                    {
                        $ItemValue.Add($FieldName,$value)
                    }
                }
                else {
                    Write-host $Row.$CSVField "is null"
                }
            }
            else {
                Write-host $CSVField " mapped field is null"
            }
        }
        Write-host "Adding List item with values:"
        $ItemValue | Format-Table
        Add-PnPListItem -List $ListName -Values $ItemValue | Out-Null

        Write-host "--------------------------------------------------------------------------------------------------------------"
    }
}
Catch {
    write-host "Error: $($_.Exception.Message)" -foregroundcolor Red
}