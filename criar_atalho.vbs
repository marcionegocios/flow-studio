Set oWS = WScript.CreateObject("WScript.Shell")
sDesktop = oWS.SpecialFolders("Desktop")
Set oFS = WScript.CreateObject("Scripting.FileSystemObject")
sScriptDir = oFS.GetParentFolderName(WScript.ScriptFullName)

Set oLink = oWS.CreateShortcut(sDesktop & "\Flow Studio.lnk")
oLink.TargetPath = sScriptDir & "\Flow Studio.cmd"
oLink.WorkingDirectory = sScriptDir

sIcon = sScriptDir & "\assets\flow_studio.ico"
If oFS.FileExists(sIcon) Then
    oLink.IconLocation = sIcon & ",0"
End If

oLink.Description = "Flow Studio - Painel Visual de Criacao de Videos com IA"
oLink.Save
WScript.Echo "[OK] Atalho criado na Area de Trabalho com sucesso!"
