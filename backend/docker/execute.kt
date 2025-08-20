import java.io.*

fun main() {
    try {
        // Read code from stdin
        val code = generateSequence(::readLine).joinToString("\n")
        
        // Write code to temporary file
        val tmpFile = File("/tmp/user_code.kt")
        tmpFile.writeText(code)
        
        // Compile the Kotlin code
        val compileProcess = ProcessBuilder("kotlinc", tmpFile.absolutePath, "-include-runtime", "-d", "/tmp/user_program.jar")
            .redirectErrorStream(true)
            .start()
        
        val compileOutput = compileProcess.inputStream.bufferedReader().readText()
        val compileExitCode = compileProcess.waitFor()
        
        if (compileExitCode != 0) {
            val result = ExecutionResult(
                success = false,
                stdout = "",
                stderr = compileOutput,
                exit_code = compileExitCode
            )
            println(Json.encodeToString(result))
            return
        }
        
        // Execute the compiled program
        val runProcess = ProcessBuilder("java", "-jar", "/tmp/user_program.jar")
            .redirectErrorStream(false)
            .start()
        
        val stdout = runProcess.inputStream.bufferedReader().readText()
        val stderr = runProcess.errorStream.bufferedReader().readText()
        val runExitCode = runProcess.waitFor()
        
        val result = """{"success":${runExitCode == 0},"stdout":"${stdout.replace("\"", "\\\"").replace("\n", "\\n")}","stderr":"${stderr.replace("\"", "\\\"").replace("\n", "\\n")}","exit_code":$runExitCode}"""
        
        println(result)
        
    } catch (e: Exception) {
        val errorResult = """{"success":false,"error":"${(e.message ?: "Unknown error").replace("\"", "\\\"")}","exit_code":1}"""
        println(errorResult)
    }
}