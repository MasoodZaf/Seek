require 'json'
require 'stringio'

# Read code from stdin
code = STDIN.read

# Write code to temporary file
tmp_file = '/tmp/user_code.rb'
File.write(tmp_file, code)

# Capture stdout and stderr
old_stdout = $stdout
old_stderr = $stderr
$stdout = StringIO.new
$stderr = StringIO.new

exit_code = 0
error_message = nil

begin
  # Execute the Ruby code
  load tmp_file
rescue SyntaxError => e
  error_message = "Ruby Syntax Error: #{e.message}"
  exit_code = 1
rescue StandardError => e
  error_message = "Ruby Error: #{e.message}"
  exit_code = 1
rescue SystemExit => e
  exit_code = e.status
end

# Get captured output
stdout_content = $stdout.string
stderr_content = $stderr.string

# Restore original stdout and stderr
$stdout = old_stdout
$stderr = old_stderr

# Add error message to stderr if present
stderr_content += error_message if error_message

# Output result as JSON
result = {
  success: exit_code == 0,
  stdout: stdout_content,
  stderr: stderr_content,
  exit_code: exit_code
}

puts result.to_json