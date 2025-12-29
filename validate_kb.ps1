# PowerShell script to validate knowledge base expansion

Write-Host "=" * 60
Write-Host "KNOWLEDGE BASE VALIDATION"
Write-Host "=" * 60

# Check healthcare KB
Write-Host "`n📊 Healthcare Knowledge Base:"
Write-Host "Checking $PSScriptRoot\src\lib\knowledge\healthcare-kb.ts"

$hcContent = Get-Content "$PSScriptRoot\src\lib\knowledge\healthcare-kb.ts" -Raw

# Count ICD-10 codes (export const icd10Codes)
$icdMatches = [regex]::Matches($hcContent, "code:\s*`"[\w.]+`"")
Write-Host "  - ICD-10 codes found: $($icdMatches.Count)"

# Count medical references
$refMatches = [regex]::Matches($hcContent, "topic:\s*`"[\w\s/:()-]+`"")
Write-Host "  - Medical references found: $($refMatches.Count)"

# Check for specific codes
$codes = @("I10", "I21", "J18", "K35", "M54.5", "G43", "F32", "E11", "R07")
Write-Host "  - Checking for key ICD-10 codes:"
foreach ($code in $codes) {
    if ($hcContent -match "`"$code`"") {
        Write-Host "    ✓ $code found"
    } else {
        Write-Host "    ✗ $code NOT found"
    }
}

# Check finance KB
Write-Host "`n📊 Finance Knowledge Base:"
Write-Host "Checking $PSScriptRoot\src\lib\knowledge\finance-kb.ts"

$finContent = Get-Content "$PSScriptRoot\src\lib\knowledge\finance-kb.ts" -Raw

# Count accounting standards
$stdMatches = [regex]::Matches($finContent, "code:\s*`"[A-Z]{3} [\w.]+`"")
Write-Host "  - Accounting standards found: $($stdMatches.Count)"

# Count financial references
$refMatches2 = [regex]::Matches($finContent, "topic:\s*`"[\w\s/:()-]+`"")
Write-Host "  - Financial references found: $($refMatches2.Count)"

# Check for specific standards
$standards = @("ASC 606", "IFRS 15", "ASC 842", "IFRS 16", "ASC 820", "ASC 326", "IFRS 9")
Write-Host "  - Checking for key standards:"
foreach ($std in $standards) {
    if ($finContent -match "`"$std`"") {
        Write-Host "    ✓ $std found"
    } else {
        Write-Host "    ✗ $std NOT found"
    }
}

Write-Host "`n" + "=" * 60
Write-Host "✅ Validation Complete!"
Write-Host "=" * 60
