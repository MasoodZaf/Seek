import java.io.*

fun main() {
    try {
        val code = generateSequence(::readLine).joinToString("\n")
        val tmpFile = File("/tmp/user_code.kt")
        tmpFile.writeText(code)

        // Build env without JAVA_TOOL_OPTIONS so child JVMs don't inherit our heap settings
        val cleanEnv = ProcessBuilder.Redirect.INHERIT.let {
            System.getenv().toMutableMap().apply {
                remove("JAVA_TOOL_OPTIONS")
                remove("_JAVA_OPTIONS")
                remove("JDK_JAVA_OPTIONS")
            }
        }

        // Compile — give kotlinc compiler 320MB heap
        val compileBuilder = ProcessBuilder(
            "kotlinc", "-J-Xmx320m", "-J-Xms64m",
            tmpFile.absolutePath, "-include-runtime", "-d", "/tmp/user_program.jar"
        ).redirectErrorStream(true)
        compileBuilder.environment().apply {
            remove("JAVA_TOOL_OPTIONS")
            remove("_JAVA_OPTIONS")
            remove("JDK_JAVA_OPTIONS")
        }
        val compileProcess = compileBuilder.start()
        val compileOutput = compileProcess.inputStream.bufferedReader().readText()
        val compileExit = compileProcess.waitFor()

        if (compileExit != 0) {
            printResult(false, "", compileOutput, compileExit)
            return
        }

        // Run compiled jar — give it 128MB heap
        val runBuilder = ProcessBuilder("java", "-Xmx128m", "-Xms32m", "-jar", "/tmp/user_program.jar")
            .redirectErrorStream(false)
        runBuilder.environment().apply {
            remove("JAVA_TOOL_OPTIONS")
            remove("_JAVA_OPTIONS")
            remove("JDK_JAVA_OPTIONS")
        }
        val runProcess = runBuilder.start()
        val stdout = runProcess.inputStream.bufferedReader().readText()
        val stderr = runProcess.errorStream.bufferedReader().readText()
        val runExit = runProcess.waitFor()
        printResult(runExit == 0, stdout, stderr, runExit)

    } catch (e: Exception) {
        printResult(false, "", e.message ?: "Unknown error", 1)
    }
}

fun escapeJson(s: String): String =
    s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")

fun printResult(success: Boolean, stdout: String, stderr: String, exitCode: Int) {
    println("""{"success":$success,"stdout":"${escapeJson(stdout)}","stderr":"${escapeJson(stderr)}","exit_code":$exitCode}""")
}
