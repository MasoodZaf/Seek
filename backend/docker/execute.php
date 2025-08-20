<?php
// Read code from stdin
$code = file_get_contents('php://stdin');

// Write code to temporary file
$tmpFile = '/tmp/user_code.php';
file_put_contents($tmpFile, $code);

// Capture output and errors
ob_start();
$errorOutput = '';

// Set up error handler
set_error_handler(function($severity, $message, $file, $line) use (&$errorOutput) {
    $errorOutput .= "PHP Error: $message in $file on line $line\n";
});

// Set up exception handler
set_exception_handler(function($exception) use (&$errorOutput) {
    $errorOutput .= "PHP Exception: " . $exception->getMessage() . "\n";
});

$exitCode = 0;
try {
    // Execute the PHP code
    include $tmpFile;
} catch (ParseError $e) {
    $errorOutput .= "PHP Parse Error: " . $e->getMessage() . "\n";
    $exitCode = 1;
} catch (Error $e) {
    $errorOutput .= "PHP Fatal Error: " . $e->getMessage() . "\n";
    $exitCode = 1;
} catch (Exception $e) {
    $errorOutput .= "PHP Exception: " . $e->getMessage() . "\n";
    $exitCode = 1;
}

$stdout = ob_get_clean();

// Output result as JSON
$result = [
    'success' => $exitCode === 0,
    'stdout' => $stdout,
    'stderr' => $errorOutput,
    'exit_code' => $exitCode
];

echo json_encode($result);
?>