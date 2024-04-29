def to_title_case(s):
    # Split the string by dashes
    parts = s.split('-')
    # Capitalize the first letter of each part and join with a space
    return ' '.join(word.capitalize() for word in parts)
