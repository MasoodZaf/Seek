import java.io.*;
import java.lang.reflect.*;
import java.util.*;
import java.util.concurrent.*;
import java.security.*;

public class Execute {
    private static final int TIMEOUT_SECONDS = 5;
    private static final long MEMORY_LIMIT = 64 * 1024 * 1024; // 64MB
    
    public static void main(String[] args) {
        try {
            // Read code from stdin
            StringBuilder codeBuilder = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            String line;
            while ((line = reader.readLine()) != null) {
                codeBuilder.append(line).append("\n");
            }
            
            String userCode = codeBuilder.toString();
            executeJavaCode(userCode);
            
        } catch (Exception e) {
            printResult(false, "", "Execution error: " + e.getMessage(), 1);
        }
    }
    
    private static void executeJavaCode(String code) {
        try {
            // Set up security manager
            System.setSecurityManager(new RestrictiveSecurityManager());
            
            // Create a temporary Java file
            File tempFile = File.createTempFile("UserCode", ".java");
            tempFile.deleteOnExit();
            
            // Extract class name from code or use default
            String className = extractClassName(code);
            if (className == null) {
                className = "UserCode";
                code = "public class " + className + " {\n" + code + "\n}";
            }
            
            // Write code to file
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(code);
            }
            
            // Compile the Java code
            Process compileProcess = new ProcessBuilder("javac", tempFile.getAbsolutePath())
                .redirectErrorStream(true)
                .start();
            
            boolean compileFinished = compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!compileFinished) {
                compileProcess.destroyForcibly();
                printResult(false, "", "Compilation timed out", 124);
                return;
            }
            
            if (compileProcess.exitValue() != 0) {
                String compileError = readProcessOutput(compileProcess);
                printResult(false, "", "Compilation error: " + compileError, 1);
                return;
            }
            
            // Execute the compiled code
            File classFile = new File(tempFile.getParent(), className + ".class");
            Process execProcess = new ProcessBuilder("java", "-cp", tempFile.getParent(), className)
                .redirectErrorStream(false)
                .start();
            
            boolean execFinished = execProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!execFinished) {
                execProcess.destroyForcibly();
                printResult(false, "", "Execution timed out", 124);
                return;
            }
            
            String stdout = readProcessOutput(execProcess.getInputStream());
            String stderr = readProcessOutput(execProcess.getErrorStream());
            
            printResult(execProcess.exitValue() == 0, stdout, stderr, execProcess.exitValue());
            
            // Cleanup
            tempFile.delete();
            if (classFile.exists()) {
                classFile.delete();
            }
            
        } catch (Exception e) {
            printResult(false, "", "Java execution error: " + e.getMessage(), 1);
        }
    }
    
    private static String extractClassName(String code) {
        // Simple regex to extract class name
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("public\\s+class\\s+(\\w+)");
        java.util.regex.Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
    
    private static String readProcessOutput(Process process) throws IOException {
        return readProcessOutput(process.getInputStream());
    }
    
    private static String readProcessOutput(InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString();
    }
    
    private static void printResult(boolean success, String stdout, String stderr, int exitCode) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("stdout", stdout);
        result.put("stderr", stderr);
        result.put("exit_code", exitCode);
        
        // Simple JSON serialization
        System.out.println("{" +
            "\"success\":" + success + "," +
            "\"stdout\":\"" + escapeJson(stdout) + "\"," +
            "\"stderr\":\"" + escapeJson(stderr) + "\"," +
            "\"exit_code\":" + exitCode +
            "}");
    }
    
    private static String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
    
    // Restrictive security manager for sandbox
    private static class RestrictiveSecurityManager extends SecurityManager {
        @Override
        public void checkPermission(Permission perm) {
            // Allow basic operations needed for execution
            if (perm instanceof RuntimePermission) {
                String name = perm.getName();
                if (name.equals("exitVM.0") || name.startsWith("accessDeclaredMembers") || 
                    name.equals("createClassLoader") || name.equals("getStackTrace")) {
                    return;
                }
            }
            
            // Block file system access
            if (perm instanceof FilePermission) {
                throw new SecurityException("File access denied");
            }
            
            // Block network access
            if (perm instanceof java.net.SocketPermission) {
                throw new SecurityException("Network access denied");
            }
        }
        
        @Override
        public void checkExit(int status) {
            throw new SecurityException("System.exit() is not allowed");
        }
    }
}