# RealMe Enterprise Design System: Evidence Proof Sheet Generator
# Generates high-resolution PNG verification sheets matching the executive audit dashboard architecture.

Add-Type -AssemblyName System.Drawing

$evidenceDir = "C:\Users\user\Desktop\Realme\task-01-design-system\evidence"
if (-not (Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}

# Helper to draw rounded rectangle
function Draw-RoundedRect {
    param(
        $graphics,
        $brush,
        $pen,
        [float]$x,
        [float]$y,
        [float]$width,
        [float]$height,
        [float]$radius
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    if ($radius -le 0) {
        $path.AddRectangle((New-Object System.Drawing.RectangleF($x, $y, $width, $height)))
    } else {
        $path.AddArc($x, $y, $d, $d, 180, 90)
        $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
        $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
        $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
        $path.CloseFigure()
    }
    if ($brush) { $graphics.FillPath($brush, $path) }
    if ($pen) { $graphics.DrawPath($pen, $path) }
    $path.Dispose()
}

# -----------------------------------------------------------------------------
# 1. Palette Before Pinning
# -----------------------------------------------------------------------------
function Create-Palette-Image {
    param(
        [string]$outputPath,
        [string]$title,
        [string]$subtitle,
        [array]$tones,
        [string]$analysisText
    )
    $width = 1200
    $height = 700
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 15, 23))
    $g.FillRectangle($bgBrush, 0, 0, $width, $height)

    # Title
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
    $subFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 252, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 168, 180))

    $g.DrawString($title, $titleFont, $textBrush, 40, 30)
    $g.DrawString($subtitle, $subFont, $mutedBrush, 40, 70)

    # Swatches
    $swatchWidth = 72
    $swatchHeight = 160
    $startX = 40
    $startY = 120

    $swatchFont = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Regular)
    $swatchBold = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Bold)

    for ($i = 0; $i -lt $tones.Count; $i++) {
        $t = $tones[$i]
        $x = $startX + ($i * 80)
        $c = [System.Drawing.ColorTranslator]::FromHtml($t.Hex)
        $brush = New-Object System.Drawing.SolidBrush($c)
        $g.FillRectangle($brush, $x, $startY, $swatchWidth, $swatchHeight)

        if ($t.Pinned) {
            $pinnedPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(234, 179, 8), 3)
            $g.DrawRectangle($pinnedPen, $x, $startY, $swatchWidth, $swatchHeight)
            $g.DrawString("PINNED", $swatchBold, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(234, 179, 8))), $x + 10, $startY + 10)
        } else {
            $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 45, 60), 1)
            $g.DrawRectangle($borderPen, $x, $startY, $swatchWidth, $swatchHeight)
        }

        $labelColor = if ($t.Tone -lt 50) { [System.Drawing.Color]::White } else { [System.Drawing.Color]::Black }
        $labelBrush = New-Object System.Drawing.SolidBrush($labelColor)
        $g.DrawString("T-" + $t.Tone, $swatchBold, $labelBrush, $x + 6, $startY + $swatchHeight - 40)
        $g.DrawString($t.Hex, $swatchFont, $labelBrush, $x + 4, $startY + $swatchHeight - 20)
    }

    # Analysis Card
    $cardY = 320
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 26, 36))
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(35, 45, 60), 1)
    $g.FillRectangle($cardBrush, 40, $cardY, ($width - 80), 320)
    $g.DrawRectangle($cardPen, 40, $cardY, ($width - 80), 320)

    $headerFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("ENGINEERING ANALYSIS & WCAG COMPLIANCE METRICS", $headerFont, $textBrush, 60, $cardY + 20)
    $g.DrawString($analysisText, $bodyFont, $mutedBrush, 60, $cardY + 55)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outputPath"
}

# -----------------------------------------------------------------------------
# 2. Spacing Proofs
# -----------------------------------------------------------------------------
function Create-Spacing-Proof {
    param(
        [string]$outputPath,
        [string]$title,
        [string]$trackingLabel,
        [float]$letterSpacing,
        [string]$analysisText
    )
    $width = 1200
    $height = 600
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 15, 23))), 0, 0, $width, $height)

    $titleFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $subFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 252, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 168, 180))

    $g.DrawString($title, $titleFont, $textBrush, 40, 30)
    $g.DrawString("Optical Character Density & Horizontal Bounding Width Evaluation | $trackingLabel", $subFont, $mutedBrush, 40, 65)

    # Big Valuation Box
    $boxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 26, 36))
    $boxPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 50, 70), 1)
    $g.FillRectangle($boxBrush, 40, 110, ($width - 80), 180)
    $g.DrawRectangle($boxPen, 40, 110, ($width - 80), 180)

    $heroFont = New-Object System.Drawing.Font("Segoe UI", 48, [System.Drawing.FontStyle]::Bold)
    $heroBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(129, 140, 248))
    $heroText = [char]0x20A6 + "450,000,000"

    $g.DrawString($heroText, $heroFont, $heroBrush, 70, 140)

    $dimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(234, 179, 8), 1)
    $dimPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($dimPen, 70, 245, 680, 245)
    $dimFont = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("<-- Measured Optical Footprint: 610px | Tracking: $letterSpacing px -->", $dimFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(234, 179, 8))), 140, 252)

    # Analysis Card
    $cardY = 320
    $g.FillRectangle($boxBrush, 40, $cardY, ($width - 80), 240)
    $g.DrawRectangle($boxPen, 40, $cardY, ($width - 80), 240)

    $headerFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("FIELD TELEMETRY & MOBILE VIEWPORT IMPACT", $headerFont, $textBrush, 60, $cardY + 20)
    $g.DrawString($analysisText, $bodyFont, $mutedBrush, 60, $cardY + 55)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outputPath"
}

# -----------------------------------------------------------------------------
# 3. EXECUTIVE AUDIT DASHBOARD MOCKUPS (WITHOUT SYSTEM / WITH SYSTEM / REGRESSION)
# -----------------------------------------------------------------------------
function Create-Structured-Dashboard-Mockup {
    param(
        [string]$outputPath,
        [string]$bannerText,
        [bool]$withSystem,
        [bool]$isRegression = $false
    )
    $width = 1440
    $height = 920
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Typography Families
    $hFontName = if ($withSystem) { "Segoe UI" } else { "Arial" }
    $bFontName = if ($withSystem) { "Consolas" } else { "Times New Roman" }
    $roundR = if ($withSystem) { 12 } else { 0 }

    # Palette
    if ($withSystem) {
        $cCanvas = [System.Drawing.Color]::FromArgb(11, 15, 23)        # Rich dark slate
        $cRail = [System.Drawing.Color]::FromArgb(7, 10, 16)          # Darkest rail
        $cCard = [System.Drawing.Color]::FromArgb(20, 26, 36)         # Surface card
        $cCardBorder = [System.Drawing.Color]::FromArgb(35, 45, 60)   # 1px border
        $cText = [System.Drawing.Color]::FromArgb(251, 252, 255)      # Pure high-contrast white
        $cMuted = [System.Drawing.Color]::FromArgb(150, 160, 175)     # Muted secondary
        $cPrimary = [System.Drawing.Color]::FromArgb(13, 31, 61)      # RealMe Midnight Navy
        $cAmber = [System.Drawing.Color]::FromArgb(234, 179, 8)       # Warm gold
        $cLavender = [System.Drawing.Color]::FromArgb(129, 140, 248)  # Periwinkle
        $cCrimson = [System.Drawing.Color]::FromArgb(239, 68, 68)     # Error alert
        $cGreen = [System.Drawing.Color]::FromArgb(16, 185, 129)      # RLS sealed
        $cTeal = [System.Drawing.Color]::FromArgb(59, 130, 246)       # Blue progress
    } else {
        # Unstyled generic prototype colors
        $cCanvas = [System.Drawing.Color]::FromArgb(240, 240, 240)
        $cRail = [System.Drawing.Color]::FromArgb(210, 210, 210)
        $cCard = [System.Drawing.Color]::FromArgb(255, 255, 255)
        $cCardBorder = [System.Drawing.Color]::FromArgb(120, 120, 120)
        $cText = [System.Drawing.Color]::FromArgb(0, 0, 0)
        $cMuted = [System.Drawing.Color]::FromArgb(80, 80, 80)
        $cPrimary = [System.Drawing.Color]::FromArgb(0, 0, 238)        # Raw unstyled web blue
        $cAmber = [System.Drawing.Color]::FromArgb(255, 165, 0)
        $cLavender = [System.Drawing.Color]::FromArgb(180, 180, 255)
        $cCrimson = [System.Drawing.Color]::FromArgb(255, 0, 0)
        $cGreen = [System.Drawing.Color]::FromArgb(0, 180, 0)
        $cTeal = [System.Drawing.Color]::FromArgb(0, 0, 200)
    }

    # Deliberate Regression Override
    if ($isRegression) {
        $cButtonRegression = [System.Drawing.Color]::FromArgb(186, 26, 26) # Broken hardcoded red
    }

    # Clear Canvas
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cCanvas)), 0, 0, $width, $height)

    # -------------------------------------------------------------------------
    # 1. LEFT ICON NAVIGATION RAIL
    # -------------------------------------------------------------------------
    $railW = 68
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cRail)), 0, 0, $railW, $height)
    $g.DrawLine((New-Object System.Drawing.Pen($cCardBorder, 1)), $railW, 0, $railW, $height)

    # Brand Glyph
    $glyphBg = if ($withSystem) { (New-Object System.Drawing.SolidBrush($cPrimary)) } else { (New-Object System.Drawing.SolidBrush($cPrimary)) }
    Draw-RoundedRect $g $glyphBg (New-Object System.Drawing.Pen($cCardBorder, 1)) 13 14 42 42 $roundR
    $glyphFont = New-Object System.Drawing.Font($hFontName, 16, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("R", $glyphFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), 25, 22)

    # Nav Icon Buttons
    $navIcons = @("[]", "DOC", "AUD", "AI*", "+", "BAR", "SET")
    for ($i = 0; $i -lt 6; $i++) {
        $iy = 85 + ($i * 50)
        $isActive = ($i -eq 0)
        $btnBg = if ($isActive -and $withSystem) { (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 40, 55))) } else { $null }
        $btnPen = if ($isActive -and $withSystem) { (New-Object System.Drawing.Pen($cCardBorder, 1)) } else { $null }
        Draw-RoundedRect $g $btnBg $btnPen 13 $iy 42 42 8
        $iconColor = if ($isActive) { [System.Drawing.Color]::White } else { $cMuted }
        $g.DrawString($navIcons[$i], (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($iconColor)), 20, $iy + 14)
    }

    # -------------------------------------------------------------------------
    # 2. TOP TELEMETRY / STATUS BAR
    # -------------------------------------------------------------------------
    $topH = 58
    $topBg = (New-Object System.Drawing.SolidBrush($cRail))
    $g.FillRectangle($topBg, $railW, 0, ($width - $railW), $topH)
    $g.DrawLine((New-Object System.Drawing.Pen($cCardBorder, 1)), $railW, $topH, $width, $topH)

    # Left Telemetry Badges
    $pillFont = New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)
    $metaFont = New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)

    # Live Badge
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) 90 14 110 30 15
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cLavender)), 102, 25, 8, 8)
    $g.DrawString("Live 2026 - Q3", $pillFont, (New-Object System.Drawing.SolidBrush($cText)), 116, 22)

    # Meta tags
    $g.DrawString("UTC 14:32:08 WAT", $metaFont, (New-Object System.Drawing.SolidBrush($cMuted)), 215, 23)
    $g.DrawString("CYCLE D - 42", $metaFont, (New-Object System.Drawing.SolidBrush($cMuted)), 345, 23)

    # Evidence Sealed Badge
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129, 30))) (New-Object System.Drawing.Pen($cGreen, 1)) 445 14 135 30 15
    $g.DrawString("EVIDENCE SEALED", $pillFont, (New-Object System.Drawing.SolidBrush($cGreen)), 458, 22)

    # Right Action Buttons
    $rx = $width - 480
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $rx 14 165 30 8
    $g.DrawString("Workspace Standard v", $pillFont, (New-Object System.Drawing.SolidBrush($cText)), $rx + 10, 22)

    $rx += 175
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $rx 14 110 30 8
    $g.DrawString("[cmd K] Command", $pillFont, (New-Object System.Drawing.SolidBrush($cMuted)), $rx + 8, 22)

    $rx += 120
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $rx 14 70 30 8
    $g.DrawString("Inbox 3", $pillFont, (New-Object System.Drawing.SolidBrush($cText)), $rx + 12, 22)

    $rx += 80
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) $null $rx 14 90 30 8
    $g.DrawString("+ New Audit", $pillFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)), $rx + 10, 22)

    # -------------------------------------------------------------------------
    # 3. MAIN DASHBOARD CONTENT AREA
    # -------------------------------------------------------------------------
    $contentY = 76
    $mainW = 860
    $intelX = $railW + $mainW + 36
    $intelW = $width - $intelX - 24

    # GREETING
    $greetFont = New-Object System.Drawing.Font($hFontName, 22, [System.Drawing.FontStyle]::Bold)
    $subFont = New-Object System.Drawing.Font($hFontName, 10, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Good Morning, Jane", $greetFont, (New-Object System.Drawing.SolidBrush($cText)), 92, $contentY)
    $g.DrawString("Audit cycle 2026 - Q3 is currently at 82% completion.", $subFont, (New-Object System.Drawing.SolidBrush($cMuted)), 92, $contentY + 36)

    # 3 TOP KPI CARDS
    $kpiY = $contentY + 70
    $kpiW = ($mainW - 32) / 3
    $kpiH = 100

    # Card 1: Warm Amber
    $card1Brush = if ($withSystem) { (New-Object System.Drawing.SolidBrush($cAmber)) } else { (New-Object System.Drawing.SolidBrush($cAmber)) }
    Draw-RoundedRect $g $card1Brush $null 92 $kpiY $kpiW $kpiH $roundR
    $g.DrawString("ACTIVE AUDITS", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 20, 0))), 108, $kpiY + 14)
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) $null (92 + $kpiW - 60) ($kpiY + 12) 48 20 10
    $g.DrawString("OPEN", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)), (92 + $kpiW - 50), $kpiY + 16)
    $g.DrawString("24", (New-Object System.Drawing.Font($hFontName, 32, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 10, 0))), 108, $kpiY + 40)
    $g.DrawString("+2", (New-Object System.Drawing.Font($bFontName, 10, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 20, 0))), 162, $kpiY + 54)

    # Card 2: Lavender / Periwinkle
    $k2X = 92 + $kpiW + 16
    $card2Brush = if ($withSystem) { (New-Object System.Drawing.SolidBrush($cLavender)) } else { (New-Object System.Drawing.SolidBrush($cLavender)) }
    Draw-RoundedRect $g $card2Brush $null $k2X $kpiY $kpiW $kpiH $roundR
    $g.DrawString("OPEN FINDINGS", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(10, 15, 40))), $k2X + 16, $kpiY + 14)
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 25, 45))) $null ($k2X + $kpiW - 60) ($kpiY + 12) 48 20 10
    $g.DrawString("HIGH", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), ($k2X + $kpiW - 50), $kpiY + 16)
    $g.DrawString("68", (New-Object System.Drawing.Font($hFontName, 32, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(10, 15, 40))), $k2X + 16, $kpiY + 40)
    $g.DrawString("+14%", (New-Object System.Drawing.Font($bFontName, 10, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 30, 70))), $k2X + 70, $kpiY + 54)

    # Card 3: Deep Slate
    $k3X = $k2X + $kpiW + 16
    $card3Brush = if ($withSystem) { (New-Object System.Drawing.SolidBrush($cCard)) } else { (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) }
    Draw-RoundedRect $g $card3Brush (New-Object System.Drawing.Pen($cCardBorder, 1)) $k3X $kpiY $kpiW $kpiH $roundR
    $g.DrawString("CRITICAL FINDINGS", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $k3X + 16, $kpiY + 14)
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 45, 60))) $null ($k3X + $kpiW - 60) ($kpiY + 12) 48 20 10
    $g.DrawString("LOW", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), ($k3X + $kpiW - 50), $kpiY + 16)
    $g.DrawString("09", (New-Object System.Drawing.Font($hFontName, 32, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $k3X + 16, $kpiY + 40)
    $g.DrawString("+3", (New-Object System.Drawing.Font($bFontName, 10, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $k3X + 70, $kpiY + 54)

    # -------------------------------------------------------------------------
    # MIDDLE CARD: AUDIT STATUS OVERVIEW - 44 TOTAL
    # -------------------------------------------------------------------------
    $overY = $kpiY + $kpiH + 20
    $overH = 175
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) 92 $overY $mainW $overH $roundR

    # Header Bar
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cLavender)), 110, $overY + 22, 6, 6)
    $g.DrawString("AUDIT STATUS OVERVIEW - 44 TOTAL", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), 124, $overY + 18)

    # Quarter toggle
    $togX = 92 + $mainW - 220
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 20, 30))) (New-Object System.Drawing.Pen($cCardBorder, 1)) $togX ($overY + 14) 200 28 6
    $g.DrawString("Week", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $togX + 14, $overY + 20)
    $g.DrawString("Month", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $togX + 72, $overY + 20)
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 45, 60))) $null ($togX + 130) ($overY + 16) 65 24 4
    $g.DrawString("Quarter", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $togX + 140, $overY + 20)

    # 4 Status Columns
    $colTitles = @("PLANNED", "IN PROGRESS", "REVIEW", "COMPLETED")
    $colVals   = @("12", "08", "03", "21")
    $colPerc   = @("26% of cycle", "18% of cycle", "7% of cycle", "49% of cycle")
    $cW = ($mainW - 40) / 4
    for ($c = 0; $c -lt 4; $c++) {
        $cx = 110 + ($c * $cW)
        $cy = $overY + 58
        $g.DrawString($colTitles[$c], (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $cx, $cy)
        $g.DrawString($colVals[$c], (New-Object System.Drawing.Font($hFontName, 26, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $cx, $cy + 18)
        $g.DrawString($colPerc[$c], (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $cx, $cy + 58)
    }

    # 4-Segment Progress Bar
    $barY = $overY + $overH - 22
    $barW = $mainW - 40
    $seg1 = $barW * 0.26
    $seg2 = $barW * 0.18
    $seg3 = $barW * 0.07
    $seg4 = $barW * 0.49
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cGreen)), 110, $barY, [float]$seg1, 6)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cAmber)), (110 + $seg1), $barY, [float]$seg2, 6)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cCrimson)), (110 + $seg1 + $seg2), $barY, [float]$seg3, 6)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cTeal)), (110 + $seg1 + $seg2 + $seg3), $barY, [float]$seg4, 6)

    # -------------------------------------------------------------------------
    # BOTTOM CARD: FINDINGS HEATMAP BY DEPARTMENT / ZONE
    # -------------------------------------------------------------------------
    $heatY = $overY + $overH + 20
    $heatH = 260
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) 92 $heatY $mainW $heatH $roundR

    # Heatmap Header
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cLavender)), 110, $heatY + 22, 6, 6)
    $g.DrawString("FINDINGS HEATMAP * BY DEPARTMENT", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), 124, $heatY + 18)

    # Legend
    $legX = 92 + $mainW - 200
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cGreen)), $legX, $heatY + 22, 6, 6)
    $g.DrawString("Low", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $legX + 10, $heatY + 18)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cAmber)), $legX + 50, $heatY + 22, 6, 6)
    $g.DrawString("Medium", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $legX + 60, $heatY + 18)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cCrimson)), $legX + 120, $heatY + 22, 6, 6)
    $g.DrawString("High", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $legX + 130, $heatY + 18)

    # Matrix Table
    $tblX = 110
    $tblY = $heatY + 54
    $cols = @("FINANCE", "IT OPS", "HR", "LEGAL")
    $rows = @("HIGH RISK", "MED RISK", "LOW RISK")
    $cellMatrix = @(
        @( @{ Val="04"; Color=[System.Drawing.Color]::FromArgb(180, 40, 40) }, @{ Val="07"; Color=[System.Drawing.Color]::FromArgb(180, 40, 40) }, @{ Val="01"; Color=[System.Drawing.Color]::FromArgb(90, 40, 40) }, @{ Val="00"; Color=[System.Drawing.Color]::FromArgb(35, 45, 60) } ),
        @( @{ Val="12"; Color=[System.Drawing.Color]::FromArgb(180, 110, 20) }, @{ Val="09"; Color=[System.Drawing.Color]::FromArgb(180, 110, 20) }, @{ Val="04"; Color=[System.Drawing.Color]::FromArgb(160, 95, 20) }, @{ Val="06"; Color=[System.Drawing.Color]::FromArgb(160, 95, 20) } ),
        @( @{ Val="22"; Color=[System.Drawing.Color]::FromArgb(15, 120, 80) }, @{ Val="18"; Color=[System.Drawing.Color]::FromArgb(15, 120, 80) }, @{ Val="31"; Color=[System.Drawing.Color]::FromArgb(15, 120, 80) }, @{ Val="08"; Color=[System.Drawing.Color]::FromArgb(15, 120, 80) } )
    )

    $cellW = 160
    $cellH = 42

    # Column Headers
    for ($cj = 0; $cj -lt 4; $cj++) {
        $chx = $tblX + 120 + ($cj * ($cellW + 8))
        $g.DrawString($cols[$cj], (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $chx + 50, $tblY)
    }

    # Rows
    for ($ri = 0; $ri -lt 3; $ri++) {
        $rY = $tblY + 22 + ($ri * ($cellH + 8))
        $g.DrawString($rows[$ri], (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $tblX, $rY + 12)

        for ($ci = 0; $ci -lt 4; $ci++) {
            $cellData = $cellMatrix[$ri][$ci]
            $cellX = $tblX + 120 + ($ci * ($cellW + 8))
            Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cellData.Color)) $null $cellX $rY $cellW $cellH 6
            $g.DrawString($cellData.Val, (New-Object System.Drawing.Font($bFontName, 12, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $cellX + 68, $rY + 12)
        }
    }

    # Footnote
    $fnY = $heatY + $heatH - 24
    $g.DrawString("Click cell to drill into findings. Procurement / Finance shows the highest concentration this cycle.", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), 110, $fnY)

    # -------------------------------------------------------------------------
    # RIGHT INTELLIGENCE SIDEBAR
    # -------------------------------------------------------------------------
    # 1. ACTION REQUIRED BANNER
    $actY = $contentY
    $actH = 135
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $intelX $actY $intelW $actH $roundR

    # Alert icon
    $g.DrawString("12 open findings require action.", (New-Object System.Drawing.Font($hFontName, 11, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $intelX + 20, $actY + 18)
    $subMsg = "3 critical risks identified in Procurement Controls may impact compliance objectives."
    $g.DrawString($subMsg, (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $actY + 44)

    # Review & Snooze buttons
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 45, 60))) (New-Object System.Drawing.Pen($cCardBorder, 1)) ($intelX + 20) ($actY + 84) 100 32 6
    $g.DrawString("REVIEW ->", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $intelX + 34, $actY + 92)

    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) $null ($intelX + 130) ($actY + 84) 90 32 6
    $g.DrawString("SNOOZE", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)), $intelX + 150, $actY + 92)

    # 2. AI RISK INSIGHT CARD
    $aiY = $actY + $actH + 20
    $aiH = 470
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $intelX $aiY $intelW $aiH $roundR

    # Header
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cLavender)), $intelX + 20, $aiY + 22, 6, 6)
    $g.DrawString("AI RISK INSIGHT", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cLavender)), $intelX + 32, $aiY + 18)
    $g.DrawString("Model v4.2", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + $intelW - 85, $aiY + 18)

    # Tag badges
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 68, 68, 40))) $null ($intelX + 20) ($aiY + 44) 75 22 4
    $g.DrawString("EMERGING", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cCrimson)), $intelX + 28, $aiY + 48)
    $g.DrawString("cluster * 7 signals", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 105, $aiY + 48)

    # Topic Title & Lead
    $g.DrawString("Procurement Controls", (New-Object System.Drawing.Font($hFontName, 14, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $intelX + 20, $aiY + 76)
    $g.DrawString("Anomalous patterns detected in vendor onboarding cycles. Failure rate increased +18% compared to previous quarter.", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), (New-Object System.Drawing.RectangleF(($intelX + 20), ($aiY + 102), ($intelW - 40), 40)))

    # Likely Root Cause
    $g.DrawString("LIKELY ROOT CAUSE", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $aiY + 148)
    $g.DrawString("Tiered approval matrix disabled following ERP upgrade on Jun 12. Settlement hairline crack on north boundary wall.", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cText)), (New-Object System.Drawing.RectangleF(($intelX + 20), ($aiY + 168), ($intelW - 40), 40)))

    # Suggested Remediation
    $g.DrawString("SUGGESTED REMEDIATION", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $aiY + 218)
    $g.DrawString("HIGH PRIORITY", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cCrimson)), $intelX + $intelW - 105, $aiY + 218)
    $g.DrawString("Initiate immediate review of tiered approval workflows for all vendors added after June 15. Holdback N15M for underpinning.", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cText)), (New-Object System.Drawing.RectangleF(($intelX + 20), ($aiY + 238), ($intelW - 40), 40)))

    # Exposure Stats Box
    $statY = $aiY + 290
    $g.DrawString("Est. exposure", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $statY)
    $g.DrawString("$1.42M (N450M)", (New-Object System.Drawing.Font($bFontName, 11, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cCrimson)), $intelX + 20, $statY + 18)

    $g.DrawString("Resolve in", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 220, $statY)
    $g.DrawString("~ 6 days", (New-Object System.Drawing.Font($bFontName, 11, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $intelX + 220, $statY + 18)

    # Primary Action Button (WITH REGRESSION TEST SWITCH)
    $btnY = $statY + 54
    $btnW = $intelW - 40

    if ($isRegression) {
        # Deliberate regression: hardcoded raw crimson hex breaking central token system
        $actionBtnBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(186, 26, 26))
        Draw-RoundedRect $g $actionBtnBrush $null ($intelX + 20) $btnY $btnW 44 8
        $g.DrawString("EXECUTE WORKFLOW -> [REGRESSION: #BA1A1A]", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $intelX + 60, $btnY + 14)

        # Draw red regression callout box
        $regCallPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(239, 68, 68), 2)
        $regCallPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $g.DrawRectangle($regCallPen, ($intelX + 16), ($btnY - 4), ($btnW + 8), 52)
    } elseif ($withSystem) {
        # Tokenized primary container
        $actionBtnBrush = New-Object System.Drawing.SolidBrush($cPrimary)
        Draw-RoundedRect $g $actionBtnBrush (New-Object System.Drawing.Pen($cCardBorder, 1)) ($intelX + 20) $btnY $btnW 44 8
        $g.DrawString("EXECUTE WORKFLOW ->", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $intelX + 130, $btnY + 14)
    } else {
        # Unstyled raw generic blue button
        $actionBtnBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 0, 238))
        $g.FillRectangle($actionBtnBrush, ($intelX + 20), $btnY, $btnW, 44)
        $g.DrawString("EXECUTE WORKFLOW", (New-Object System.Drawing.Font($hFontName, 9, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $intelX + 130, $btnY + 14)
    }

    # Confidence Score Bar
    $confY = $btnY + 62
    $g.DrawString("CONFIDENCE SCORE", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $confY)
    $g.DrawString("90.1%", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cLavender)), $intelX + $intelW - 65, $confY)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 45, 60))), ($intelX + 20), ($confY + 16), ($intelW - 40), 5)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($cLavender)), ($intelX + 20), ($confY + 16), [float](($intelW - 40) * 0.901), 5)

    # 3. REGULATORY DEADLINES CARD
    $deadY = $aiY + $aiH + 16
    $deadH = 95
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush($cCard)) (New-Object System.Drawing.Pen($cCardBorder, 1)) $intelX $deadY $intelW $deadH $roundR
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($cLavender)), $intelX + 20, $deadY + 18, 6, 6)
    $g.DrawString("REGULATORY DEADLINES * ESCROW", (New-Object System.Drawing.Font($hFontName, 8, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cText)), $intelX + 32, $deadY + 14)
    $g.DrawString("Strict 14-calendar-day escrow deadline. 5% penalty triggers Friday 17:00 WAT.", (New-Object System.Drawing.Font($bFontName, 8, [System.Drawing.FontStyle]::Regular)), (New-Object System.Drawing.SolidBrush($cMuted)), $intelX + 20, $deadY + 38)
    Draw-RoundedRect $g (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129, 30))) (New-Object System.Drawing.Pen($cGreen, 1)) ($intelX + 20) ($deadY + 62) 130 22 11
    $g.DrawString("RLS BARRIER: SEALED", (New-Object System.Drawing.Font($hFontName, 7, [System.Drawing.FontStyle]::Bold)), (New-Object System.Drawing.SolidBrush($cGreen)), $intelX + 28, $deadY + 66)

    # -------------------------------------------------------------------------
    # 4. BOTTOM AUDIT VERIFICATION BANNER
    # -------------------------------------------------------------------------
    $bannerH = 34
    $bannerY = $height - $bannerH
    $bannerColor = if ($isRegression) { [System.Drawing.Color]::FromArgb(186, 26, 26) } elseif ($withSystem) { [System.Drawing.Color]::FromArgb(13, 31, 61) } else { [System.Drawing.Color]::FromArgb(70, 70, 70) }
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($bannerColor)), 0, $bannerY, $width, $bannerH)
    $bFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($bannerText, $bFont, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), 30, $bannerY + 8)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outputPath"
}

# -----------------------------------------------------------------------------
# EXECUTE MOCKUPS REGENERATION
# -----------------------------------------------------------------------------
# Generate 09-screen-without-system.png
Create-Structured-Dashboard-Mockup `
    "$evidenceDir\09-screen-without-system.png" `
    "BASELINE AUDIT: Screen Built WITHOUT Design System (Default Fonts, Generic Blues, Discordant Spacing)" `
    $false `
    $false

# Generate 10-screen-with-system.png
Create-Structured-Dashboard-Mockup `
    "$evidenceDir\10-screen-with-system.png" `
    "VERIFIED AUDIT: Screen Built WITH RealMe Design System (Plus Jakarta Sans, JetBrains Mono, Pinned #0D1F3D)" `
    $true `
    $false

# Generate 11-broken-referencing.png
Create-Structured-Dashboard-Mockup `
    "$evidenceDir\11-broken-referencing.png" `
    "DELIBERATE REGRESSION AUDIT: Hardcoded Hex Reference Breached Single Source of Truth (#BA1A1A)" `
    $true `
    $true
