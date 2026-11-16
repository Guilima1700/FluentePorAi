# Optional Windows helper. The generated PNG is committed; Vercel does not run this script.
Add-Type -AssemblyName System.Drawing
$bitmap = [Drawing.Bitmap]::new(1200,630)
$graphics = [Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([Drawing.ColorTranslator]::FromHtml('#c1121f'))
$graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$brush = [Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#fef0d5'))
$small = [Drawing.Font]::new('Segoe UI',23,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
$brand = [Drawing.Font]::new('Segoe UI',31,[Drawing.FontStyle]::Bold,[Drawing.GraphicsUnit]::Pixel)
$title = [Drawing.Font]::new('Segoe UI',78,[Drawing.FontStyle]::Bold,[Drawing.GraphicsUnit]::Pixel)
try {
  $graphics.DrawString('FLUENTE POR AÍ',$brand,$brush,72,62)
  $graphics.DrawString('Seu próximo passo',$title,$brush,66,205)
  $graphics.DrawString('fala inglês.',$title,$brush,66,302)
  $graphics.DrawString('Cursos de inglês online · Conversação · Carreira · Viagens',$small,$brush,72,538)
  $destination = Join-Path (Split-Path -Parent $PSScriptRoot) 'public/og/site.png'
  [IO.Directory]::CreateDirectory((Split-Path -Parent $destination)) | Out-Null
  $bitmap.Save($destination,[Drawing.Imaging.ImageFormat]::Png)
} finally { $small.Dispose(); $brand.Dispose(); $title.Dispose(); $brush.Dispose(); $graphics.Dispose(); $bitmap.Dispose() }
