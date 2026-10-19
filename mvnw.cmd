@echo off
setlocal
set "MAVEN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd"
if exist "backend\pom.xml" (
    set "POM_ARG=-f backend\pom.xml"
) else (
    set "POM_ARG="
)

if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %POM_ARG% %*
) else (
    call mvn %POM_ARG% %*
)
