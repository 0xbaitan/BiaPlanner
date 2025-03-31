#include <mysql.h>
#include <string.h>

// Initialization function (optional)
extern "C" bool hello_init(UDF_INIT* initid, UDF_ARGS* args, char* message) {
    if (args->arg_count != 0) {
        strcpy(message, "This function does not accept any arguments.");
        return 1; // Non-zero indicates an error
    }
    return 0; // Success
}

// Main function
extern "C" char* hello(UDF_INIT* initid, UDF_ARGS* args, char* result, unsigned long* length, char* is_null, char* error) {
    const char* message = "Hello, World!";
    *length = strlen(message);
    strcpy(result, message);
    return result;
}

// Deinitialization function (optional)
extern "C" void hello_deinit(UDF_INIT* initid) {
    // Clean up resources if needed
}
