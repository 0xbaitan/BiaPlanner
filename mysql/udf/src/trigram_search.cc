#include <mysql.h>
#include <string>
#include <vector>
#include <algorithm>
#include <cstring>
#include <set>

// Helper function to generate trigrams from a string
std::set<std::string> generate_trigrams(const std::string& input) {
    std::set<std::string> trigrams;
    if (input.length() < 3) {
        return trigrams; // Return an empty set for strings shorter than 3 characters
    }
    std::string padded = "  " + input + " ";
    for (size_t i = 0; i < padded.size() - 2; ++i) {
        trigrams.insert(padded.substr(i, 3));
    }
    return trigrams;
}

// Initialization function (optional)
extern "C" bool trigram_search_init(UDF_INIT* initid, UDF_ARGS* args, char* message) {
    // Ensure there are exactly two arguments and both are strings
    if (args->arg_count != 2 || args->arg_type[0] != STRING_RESULT || args->arg_type[1] != STRING_RESULT) {
        strcpy(message, "trigram_search() requires two string arguments.");
        return 1; // Error
    }
    return 0; // Success
}

// Main function
extern "C" double trigram_search(UDF_INIT* initid, UDF_ARGS* args, char* is_null, char* error) {
    // Extract arguments
    const char* search_string = args->args[0];
    const char* target_string = args->args[1];

    if (!search_string || !target_string) {
        *is_null = 1;
        return 0.0;
    }

    std::string search_str(search_string);
    std::string target_str(target_string);

    // Generate trigrams for both strings
    auto search_trigrams = generate_trigrams(search_str);
    auto target_trigrams = generate_trigrams(target_str);

    if (search_trigrams.empty() || target_trigrams.empty()) {
        return 0.0; // Return 0 if either string is too short for trigrams
    }

    

    // Count matching trigrams
    size_t matched_trigrams = 0;
    for (const auto& trigram : search_trigrams) {
        if (target_trigrams.find(trigram) != target_trigrams.end()) {
            ++matched_trigrams;
        }
    }

    // Calculate total number of trigrams in the search string
    size_t total_trigrams = search_trigrams.size();

    // Return similarity score (matched / total)
    if (total_trigrams > 0) {
        return static_cast<double>(matched_trigrams) / static_cast<double>(total_trigrams);
    } else {
        return 0.0;
    }
}

// Deinitialization function (optional)
extern "C" void trigram_search_deinit(UDF_INIT* initid) {
    // No cleanup required
}
