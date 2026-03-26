import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

public class Execute {
    private static final int TIMEOUT_SECONDS = 10;

    public static void main(String[] args) {
        try {
            StringBuilder codeBuilder = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            String line;
            while ((line = reader.readLine()) != null) {
                codeBuilder.append(line).append("\n");
            }
            executeJavaCode(codeBuilder.toString());
        } catch (Exception e) {
            printResult(false, "", "Execution error: " + e.getMessage(), 1);
        }
    }

    private static void executeJavaCode(String code) {
        Path tempDir = null;
        try {
            // Extract or assign class name
            String className = extractClassName(code);
            if (className == null) {
                className = "UserCode";
                code = "public class " + className + " {\n" + code + "\n}";
            }

            // Create temp directory and source file named after the class
            tempDir = Files.createTempDirectory("javarun");
            File srcFile = new File(tempDir.toFile(), className + ".java");
            try (FileWriter w = new FileWriter(srcFile)) {
                w.write(code);
            }

            // Compile
            Process compileProc = new ProcessBuilder("javac", srcFile.getAbsolutePath())
                    .redirectErrorStream(true)
                    .start();
            boolean compiled = compileProc.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!compiled) {
                compileProc.destroyForcibly();
                printResult(false, "", "Compilation timed out", 124);
                return;
            }
            if (compileProc.exitValue() != 0) {
                String err = readStream(compileProc.getInputStream());
                printResult(false, "", "Compilation error:\n" + err, 1);
                return;
            }

            // Run
            Process runProc = new ProcessBuilder("java", "-cp", tempDir.toString(), className)
                    .start();
            boolean finished = runProc.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!finished) {
                runProc.destroyForcibly();
                printResult(false, "", "Execution timed out", 124);
                return;
            }

            String stdout = readStream(runProc.getInputStream());
            String stderr = readStream(runProc.getErrorStream());
            printResult(runProc.exitValue() == 0, stdout, stderr, runProc.exitValue());

        } catch (Exception e) {
            printResult(false, "", "Java execution error: " + e.getMessage(), 1);
        } finally {
            if (tempDir != null) {
                try {
                    Files.walk(tempDir)
                         .sorted(Comparator.reverseOrder())
                         .map(Path::toFile)
                         .forEach(File::delete);
                } catch (Exception ignored) {}
            }
        }
    }

    private static String extractClassName(String code) {
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("public\\s+class\\s+(\\w+)")
                .matcher(code);
        return m.find() ? m.group(1) : null;
    }

    private static String readStream(InputStream is) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(is))) {
            String l;
            while ((l = r.readLine()) != null) sb.append(l).append("\n");
        }
        return sb.toString();
    }

    private static void printResult(boolean success, String stdout, String stderr, int exitCode) {
        System.out.println("{" +
            "\"success\":" + success + "," +
            "\"stdout\":\"" + escapeJson(stdout) + "\"," +
            "\"stderr\":\"" + escapeJson(stderr) + "\"," +
            "\"exit_code\":" + exitCode +
        "}");
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
