high_keywords = [
    "scared", "afraid", "terrified", "threat", "threatened",
    "unsafe", "danger", "dangerous", "kill", "hurt",
    "attack", "attacked", "assault", "assaulted",
    "harass", "harassed", "panic"
]

# Medium stress keywords
medium_keywords = [
    "alone", "helpless", "hopeless", "worried", "anxious",
    "anxiety", "stressed", "crying", "intimidated",
    "nervous", "insecure", "distressed", "isolated",
    "trapped", "overwhelmed", "fear", "unheard"
]

# Low stress keywords
low_keywords = [
    "sad", "upset", "confused", "tired", "uncomfortable",
    "concerned", "disturbed", "uneasy", "frustrated",
    "discouraged", "hesitant", "doubtful", "unsure",
    "low", "down", "troubled"
]

# Points
HIGH_POINTS = 3
MEDIUM_POINTS = 2
LOW_POINTS = 1
MAX_SCORE = 10


# Function to calculate score
def calculate_score(message):

    message = message.lower()
    score = 0

    for word in high_keywords:
        if word in message:
            score += HIGH_POINTS

    for word in medium_keywords:
        if word in message:
            score += MEDIUM_POINTS

    for word in low_keywords:
        if word in message:
            score += LOW_POINTS

    if score > MAX_SCORE:
        score = MAX_SCORE

    return score


# Function to decide stress level
def get_stress_level(score):

    if score <= 4:
        return "Low"

    elif score <= 7:
        return "Medium"

    else:
        return "High"


# Main program
def main():

    # Take input from user
    name = input("Enter your name: ")
    message = input("Enter your message: ")

    # Calculate score
    score = calculate_score(message)

    # Get stress level
    level = get_stress_level(score)

    # Display result
    print("\n----- RESULT -----")
    print("Name:", name)
    print("Message:", message)
    print("Score:", score, "/10")
    print("Stress Level:", level)

    # Write score to file
    with open("/tmp/score.txt", "w") as f:

        f.write("Name: " + name + "\n")
        f.write("Message: " + message + "\n")
        f.write("Score: " + str(score) + "/10\n")
        f.write("Stress Level: " + level + "\n")

    # Escalation logic
    with open("/tmp/alert.txt", "w") as f:

        if level == "High":

            f.write("ALERT: High stress detected. Immediate attention is recommended.\n")

            print("\nALERT: High stress detected.")

        else:

            f.write("Support: You are not alone. Consider talking to someone you trust.\n")

            print("\nSupport: You are not alone. Consider talking to someone you trust.")

    print("\nFiles created successfully.")
    print("Score file: /tmp/score.txt")
    print("Alert file: /tmp/alert.txt")


# Run the program
if __name__ == "__main__":
    main()