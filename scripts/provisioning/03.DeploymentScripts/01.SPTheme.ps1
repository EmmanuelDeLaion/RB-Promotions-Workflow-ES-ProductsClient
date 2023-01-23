$themepalette = @{
    "themePrimary" = "#f31078";
    "themeLighterAlt" = "#fef6fa";
    "themeLighter" = "#fcdded";
    "themeLight" = "#f9bfdd";
    "themeTertiary" = "#f383bd";
    "themeSecondary" = "#ed4c9f";
    "themeDarkAlt" = "#d33185";
    "themeDark" = "#b22970";
    "themeDarker" = "#831e52";
    "neutralLighterAlt" = "#faf9f8";
    "neutralLighter" = "#FEF5F9";
    "neutralLight" = "#edebe9";
    "neutralQuaternaryAlt" = "#e1dfdd";
    "neutralQuaternary" = "#d0d0d0";
    "neutralTertiaryAlt" = "#c8c6c4";
    "neutralTertiary" = "#595959";
    "neutralSecondary" = "#373737";
    "neutralPrimaryAlt" = "#2f2f2f";
    "neutralPrimary" = "#323130";
    "neutralDark" = "#151515";
    "black" = "#0b0b0b";
    "white" = "#ffffff";
 }

Add-SPOTheme -Identity "RB Pink" -Palette $themepalette -IsInverted $false