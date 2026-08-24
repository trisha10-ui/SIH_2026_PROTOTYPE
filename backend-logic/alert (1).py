high_keywords = [
    "scared", "afraid", "terrified", "threat", "threatened",
    "unsafe", "danger", "dangerous", "kill", "hurt",
    "attack", "attacked", "assault", "assaulted",
    "harass", "harassed", "panic"
]

medium_keywords = [
    "alone", "helpless", "hopeless", "worried", "anxious",
    "anxiety", "stressed", "crying", "intimidated",
    "nervous", "insecure", "distressed", "isolated",
    "trapped", "overwhelmed", "fear", "unheard"
]

low_keywords = [
    "sad", "upset", "confused", "tired", "uncomfortable",
    "concerned", "disturbed", "uneasy", "frustrated",
    "discouraged", "hesitant", "doubtful", "unsure",
    "low", "down", "troubled"
]

HIGH_POINTS = 3
MEDIUM_POINTS = 2
LOW_POINTS = 1
MAX_SCORE = 10


def calculate_score(message):
    message = message.lower()
    score = 0
    matched = []

    for word in high_keywords:
        if word in message:
            score += HIGH_POINTS
            matched.append(word)

    for word in medium_keywords:
        if word in message:
            score += MEDIUM_POINTS
            matched.append(word)

    for word in low_keywords:
        if word in message:
            score += LOW_POINTS
            matched.append(word)

    if score > MAX_SCORE:
        score = MAX_SCORE

    return score, matched


def get_stress_level(score):
    if score <= 4:
        return "Low"
    elif score <= 7:
        return "Medium"
    else:
        return "High"


def main():
    name = input("Enter your name: ")
    message = input("Enter your message: ")

    score, matched = calculate_score(message)
    level = get_stress_level(score)
    indicators = ", ".join(matched) if matched else "None detected"

    print("\n----- RESULT -----")
    print("Name:", name)
    print("Message:", message)
    print("Score:", score, "/10")
    print("Stress Level:", level)
    print("Indicators:", indicators)

    # Append (not overwrite) so every run adds a new case for the dashboard
    with open("score.txt", "a") as f:
        f.write("Message: " + message + "\n")
        f.write("Score: " + str(score) + "/10\n")
        f.write("Stress Level: " + level + "\n")
        f.write("Indicators: " + indicators + "\n")
        f.write("-" * 50 + "\n")

    if level == "High":
        print("\nALERT: High stress detected. Immediate attention recommended.")
    else:
        print("\nSupport: You are not alone. Consider talking to someone you trust.")

    print("\nEntry added to score.txt (same folder as this script)")


if __name__ == "__main__":
    main()
