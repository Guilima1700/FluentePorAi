# Technical favicon export: preserve the supplied emblem and its aspect ratio.
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$source = [Drawing.Image]::FromFile((Join-Path $root 'public/brand/emblema-creme.png'))
function Export-SquarePng([int]$size) {
    $bitmap = [Drawing.Bitmap]::new($size,$size)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $stream = [IO.MemoryStream]::new()
    try {
        $graphics.Clear([Drawing.ColorTranslator]::FromHtml('#fef0d5'))
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $scale = ($size * .875) / [Math]::Max($source.Width,$source.Height)
        $width = [single]($source.Width * $scale)
        $height = [single]($source.Height * $scale)
        $graphics.DrawImage($source,[single](($size-$width)/2),[single](($size-$height)/2),$width,$height)
        $bitmap.Save($stream,[Drawing.Imaging.ImageFormat]::Png)
        return ,$stream.ToArray()
    } finally { $stream.Dispose(); $graphics.Dispose(); $bitmap.Dispose() }
}
try {
    [IO.File]::WriteAllBytes((Join-Path $root 'public/favicon-96x96.png'),(Export-SquarePng 96))
    [IO.File]::WriteAllBytes((Join-Path $root 'public/apple-touch-icon.png'),(Export-SquarePng 180))
    $frames = @(16,32,48,96,256 | ForEach-Object { @{ Size=$_; Bytes=(Export-SquarePng $_) } })
    $file = [IO.File]::Create((Join-Path $root 'public/favicon.ico'))
    $writer = [IO.BinaryWriter]::new($file)
    try {
        $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]$frames.Count)
        $offset = 6 + 16 * $frames.Count
        foreach($frame in $frames) {
            $dimension = if($frame.Size -eq 256){0}else{$frame.Size}
            $writer.Write([byte]$dimension); $writer.Write([byte]$dimension)
            $writer.Write([byte]0); $writer.Write([byte]0)
            $writer.Write([uint16]1); $writer.Write([uint16]32)
            $writer.Write([uint32]$frame.Bytes.Length); $writer.Write([uint32]$offset)
            $offset += $frame.Bytes.Length
        }
        foreach($frame in $frames){ $writer.Write([byte[]]$frame.Bytes) }
    } finally { $writer.Dispose() }
} finally { $source.Dispose() }
