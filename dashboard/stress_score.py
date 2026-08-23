"""
SIH 2026 - PS 26093
AI-Based Stress/Trauma Assessment - Keyword Scoring Script
Owner: Anchal + Sahyadri

What this does:
1. Reads messages.txt line by line
2. Skips heading lines (===...===, "Keywords:" lines, blank lines)
3. For each real message, checks how many distress keywords it contains
4. Adds up points for each keyword found (High=3, Medium=2, Low=1)
5. Caps the total score at 10
6. Decides the stress level:
       0-4  -> Low
       5-7  -> Medium
       8-10 -> High
7. Writes results to score.txt in a clean, readable format:
       Message: ...
       Score: .../10
       Stress Level: ...
       -------------------------------
   (one block per message, separated by a dashed line)
"""

# ---- STEP 1: Keyword lists with their point values ----

high_keywords = [
    "scared", "afraid", "terrified", "threat", "threatened", "unsafe",
    "danger", "dangerous", "kill", "hurt", "attack", "attacked",
    "assault", "assaulted", "harass", "harassed", "panic"
]

medium_keywords = [
    "alone", "helpless", "hopeless", "worried", "anxious", "anxiety",
    "stressed", "crying", "intimidated", "nervous", "insecure",
    "distressed", "isolated", "trapped", "overwhelmed", "fear", "unheard"
]

low_keywords = [
    "sad", "upset", "confused", "tired", "uncomfortable", "concerned",
    "disturbed", "uneasy", "frustrated", "discouraged", "hesitant",
    "doubtful", "unsure", "low", "down", "troubled"
]

HIGH_POINTS = 3
MEDIUM_POINTS = 2
LOW_POINTS = 1
MAX_SCORE = 10


# ---- STEP 2: Function to calculate score for one message ----

def calculate_score(message):
    message_lower = message.lower()
    total_score = 0
    indicators = []

    for word in high_keywords:
        if word in message_lower:
            total_score += HIGH_POINTS
            indicators.append(word)

    for word in medium_keywords:
        if word in message_lower:
            total_score += MEDIUM_POINTS
            indicators.append(word)

    for word in low_keywords:
        if word in message_lower:
            total_score += LOW_POINTS
            indicators.append(word)

    if total_score > MAX_SCORE:
        total_score = MAX_SCORE

    return total_score, indicators


def get_stress_level(score):
    if score <= 4:
        return "Low"
    elif score <= 7:
        return "Medium"
    else:
        return "High"


def is_skippable(line):
    line = line.strip()

    if line == "":
        return True

    if line.startswith("==="):
        return True

    if line.startswith("Keywords:"):
        return True

    return False


def main():

    input_file = "messages.txt"
    output_file = "score.txt"

    results = []

    with open(input_file, "r", encoding="utf-8") as f:

        for line in f:

            message = line.strip()

            if is_skippable(message):
                continue

            score, indicators = calculate_score(message)

            level = get_stress_level(score)

            results.append(
                (message, score, level, indicators)
            )


    with open(output_file, "w", encoding="utf-8") as f:

        for message, score, level, indicators in results:

            f.write(f"Message: {message}\n")

            f.write(f"Score: {score}/10\n")

            f.write(f"Stress Level: {level}\n")

            if indicators:
                f.write(
                    f"Indicators: {', '.join(indicators)}\n"
                )
            else:
                f.write(
                    "Indicators: None detected\n"
                )

            f.write("-" * 50 + "\n")


    print(
        f"Done! Processed {len(results)} messages."
    )

    print(
        f"Results written to {output_file}"
    )


if __name__ == "__main__":
    main()